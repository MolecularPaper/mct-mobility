import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { reactClickToComponent } from "vite-plugin-react-click-to-component";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), reactClickToComponent(), tailwindcss()],
  server: {
    host: true, // 외부 접근을 허용하기 위해 필요
    strictPort: true,
    port: 5173,
    hmr: {
      clientPort: 443, // Codespaces 환경에서는 HTTPS 포트(443)를 통해 WebSocket 통신을 해야함.
    },
  },
});
