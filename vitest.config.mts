import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    css: true,
    // Mock external deps
    mockReset: true,
    // coverage: {
    //   provider: "v8",
    //   reporter: ["text", "html"],
    // },
  },
});
