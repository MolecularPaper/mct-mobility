import { StrictMode } from "react";
import { StaticRouter } from "react-router-dom";

import {
  type RenderToPipeableStreamOptions,
  renderToPipeableStream,
} from "react-dom/server";

import Router from "./pages/Router";

export function render(_url: string, options?: RenderToPipeableStreamOptions) {
  return renderToPipeableStream(
    <StrictMode>
      <StaticRouter location={_url}>
        <Router />
      </StaticRouter>
    </StrictMode>,
    options,
  );
}
