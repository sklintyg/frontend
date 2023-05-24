// vite.config.ts
import react from "file:///home/samuel/sklintyg/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "node:path";
import dts from "file:///home/samuel/sklintyg/frontend/node_modules/vite-plugin-dts/dist/index.mjs";
import { defineConfig } from "file:///home/samuel/sklintyg/frontend/node_modules/vitest/dist/config.js";
var __vite_injected_original_dirname = "/home/samuel/sklintyg/frontend/packages/common";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    emptyOutDir: false,
    sourcemap: true,
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "common",
      formats: ["es", "umd"],
      fileName: (format) => `common.${format}.js`
    },
    rollupOptions: {
      external: ["react", "react-dom", "styled-components"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "styled-components": "styled"
        }
      }
    }
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/setupTests.ts"],
    coverage: {
      reporter: ["text", "json"],
      all: true
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9zYW11ZWwvc2tsaW50eWcvZnJvbnRlbmQvcGFja2FnZXMvY29tbW9uXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9zYW11ZWwvc2tsaW50eWcvZnJvbnRlbmQvcGFja2FnZXMvY29tbW9uL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3NhbXVlbC9za2xpbnR5Zy9mcm9udGVuZC9wYWNrYWdlcy9jb21tb24vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cydcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGVzdC9jb25maWcnXG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGR0cyh7XG4gICAgICBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxuICAgIH0pLFxuICBdLFxuICBidWlsZDoge1xuICAgIGVtcHR5T3V0RGlyOiBmYWxzZSxcbiAgICBzb3VyY2VtYXA6IHRydWUsXG4gICAgbGliOiB7XG4gICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9pbmRleC50cycpLFxuICAgICAgbmFtZTogJ2NvbW1vbicsXG4gICAgICBmb3JtYXRzOiBbJ2VzJywgJ3VtZCddLFxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IGBjb21tb24uJHtmb3JtYXR9LmpzYCxcbiAgICB9LFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIGV4dGVybmFsOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdzdHlsZWQtY29tcG9uZW50cyddLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICByZWFjdDogJ1JlYWN0JyxcbiAgICAgICAgICAncmVhY3QtZG9tJzogJ1JlYWN0RE9NJyxcbiAgICAgICAgICAnc3R5bGVkLWNvbXBvbmVudHMnOiAnc3R5bGVkJyxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgdGVzdDoge1xuICAgIGdsb2JhbHM6IHRydWUsXG4gICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgc2V0dXBGaWxlczogWydzcmMvc2V0dXBUZXN0cy50cyddLFxuICAgIGNvdmVyYWdlOiB7XG4gICAgICByZXBvcnRlcjogWyd0ZXh0JywgJ2pzb24nXSxcbiAgICAgIGFsbDogdHJ1ZSxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNFQsT0FBTyxXQUFXO0FBQzlVLE9BQU8sVUFBVTtBQUNqQixPQUFPLFNBQVM7QUFDaEIsU0FBUyxvQkFBb0I7QUFIN0IsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0Ysa0JBQWtCO0FBQUEsSUFDcEIsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLGFBQWE7QUFBQSxJQUNiLFdBQVc7QUFBQSxJQUNYLEtBQUs7QUFBQSxNQUNILE9BQU8sS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUM3QyxNQUFNO0FBQUEsTUFDTixTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsTUFDckIsVUFBVSxDQUFDLFdBQVcsVUFBVTtBQUFBLElBQ2xDO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsU0FBUyxhQUFhLG1CQUFtQjtBQUFBLE1BQ3BELFFBQVE7QUFBQSxRQUNOLFNBQVM7QUFBQSxVQUNQLE9BQU87QUFBQSxVQUNQLGFBQWE7QUFBQSxVQUNiLHFCQUFxQjtBQUFBLFFBQ3ZCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxNQUFNO0FBQUEsSUFDSixTQUFTO0FBQUEsSUFDVCxhQUFhO0FBQUEsSUFDYixZQUFZLENBQUMsbUJBQW1CO0FBQUEsSUFDaEMsVUFBVTtBQUFBLE1BQ1IsVUFBVSxDQUFDLFFBQVEsTUFBTTtBQUFBLE1BQ3pCLEtBQUs7QUFBQSxJQUNQO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
