import fs from "node:fs/promises";
import express from "express";
import { Transform } from "node:stream";

import taxiRouter from "./src/routes/taxi";
import carpoolRouter from "./src/routes/carpool";
import userRouter from "./src/routes/user";

// Constants
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5173;
const base = process.env.BASE || "/";
const ABORT_DELAY = 10000;

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";

// Create http server
const app = express();

// Add Vite or respective production middlewares
/** @type {import('vite').ViteDevServer | undefined} */
let vite: import("vite").ViteDevServer | undefined;
if (!isProduction) {
  const { createServer } = await import("vite");
  vite = await createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  // @ts-expect-error compression has no types
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

app.use(express.json());
app.use(userRouter);
app.use(carpoolRouter);
app.use(taxiRouter);

// Serve HTML
app.use("*all", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    /** @type {string} */
    let template;
    /** @type {import('./src/entry-server.ts').render} */
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite!.transformIndexHtml(url, template);
      render = (await vite!.ssrLoadModule("/src/entry-server.tsx")).render;
    } else {
      template = templateHtml;
      const serverEntry = "./server/entry-server.js";
      // @ts-expect-error dist files exist after build
      render = (await import(/* @vite-ignore */ serverEntry)).render;
    }

    let didError = false;

    const { pipe, abort } = render(url, {
      onShellError() {
        res.status(500);
        res.set({ "Content-Type": "text/html" });
        res.send("<h1>Something went wrong</h1>");
      },
      onShellReady() {
        res.status(didError ? 500 : 200);
        res.set({ "Content-Type": "text/html" });

        const [htmlStart, htmlEnd] = template.split(`<!--app-html-->`);

        const transformStream = new Transform({
          transform(chunk, encoding, callback) {
            res.write(chunk, encoding);
            callback();
          },
        });
        transformStream.on("finish", () => {
          res.write(htmlEnd);
          res.end();
        });

        res.write(htmlStart);
        pipe(transformStream);
      },
      onError(error: unknown) {
        didError = true;
        console.error(error);
      },
    });

    setTimeout(() => abort(), ABORT_DELAY);
  } catch (e) {
    const error = e instanceof Error ? e : new Error(String(e));
    vite?.ssrFixStacktrace(error);
    console.log(error.stack);
    res.status(500).end(error.stack);
  }
});

// Start http server
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
