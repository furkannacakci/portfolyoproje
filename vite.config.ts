import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  resolve: {
    alias: {
      "@": path.resolve(__dirname, ".")
    }
  },
  build: {
    outDir: "dist"
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000"
    }
  }
});
