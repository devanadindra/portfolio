import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  base: "/",
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@react-jvectormap/core")) {
            return "jvectormap";
          }
        },
      },
    },
    minify: 'esbuild',
    terserOptions: {
      compress: {
        pure_funcs: ["eval"],
      },
    },
  },
});
