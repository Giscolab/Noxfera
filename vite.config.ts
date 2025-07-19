import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: [
      'clean-css',
      'html-minifier-terser',
      '@jridgewell/trace-mapping'
    ]
  },
  build: {
    sourcemap: false,
    rollupOptions: {
      external: [
        'clean-css',
        'html-minifier-terser',
        '@jridgewell/trace-mapping'
      ]
    }
  }
}));
