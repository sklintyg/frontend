// vite.config.ts
import basicSsl from "file:///home/samuel/sklintyg/frontend/node_modules/.pnpm/@vitejs+plugin-basic-ssl@1.0.1_vite@4.1.1/node_modules/@vitejs/plugin-basic-ssl/dist/index.mjs";
import react from "file:///home/samuel/sklintyg/frontend/node_modules/.pnpm/@vitejs+plugin-react@3.1.0_vite@4.1.1/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { loadEnv } from "file:///home/samuel/sklintyg/frontend/node_modules/.pnpm/vite@4.1.1_@types+node@14.14.31/node_modules/vite/dist/node/index.js";
import { defineConfig } from "file:///home/samuel/sklintyg/frontend/node_modules/.pnpm/vitest@0.29.7_jsdom@21.1.1/node_modules/vitest/dist/config.js";
var vite_config_default = ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode ?? "development", process.cwd()) };
  const https = process.env.VITE_HTTPS === "true";
  const hmr = !(process.env.VITE_HMR === "false");
  const host = process.env.VITE_HOST ?? "localhost";
  const hmrProtocol = process.env.VITE_WS_PROTOCOL ?? https ? "wss" : "ws";
  const proxy = ["api", "services", "fake", "error.jsp", "logout", "welcome.html", "saml"].reduce(
    (result, route) => ({
      ...result,
      [`/${route}`]: {
        target: process.env.VITE_API_TARGET ?? "https://rehabstod-devtest.intyg.nordicmedtest.se",
        cookieDomainRewrite: { "*": "" },
        protocolRewrite: "https",
        changeOrigin: true,
        autoRewrite: true
      }
    }),
    {}
  );
  return defineConfig({
    plugins: [react()].concat(https ? [basicSsl()] : []),
    server: {
      host,
      https,
      port: 5173,
      proxy,
      strictPort: true,
      hmr: hmr ? { host, protocol: hmrProtocol } : false
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["src/setupTests.ts"],
      deps: {
        inline: ["@inera/ids-core"]
      }
    }
  });
};
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9zYW11ZWwvc2tsaW50eWcvZnJvbnRlbmQvYXBwcy9yZWhhYnN0b2RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9ob21lL3NhbXVlbC9za2xpbnR5Zy9mcm9udGVuZC9hcHBzL3JlaGFic3RvZC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vaG9tZS9zYW11ZWwvc2tsaW50eWcvZnJvbnRlbmQvYXBwcy9yZWhhYnN0b2Qvdml0ZS5jb25maWcudHNcIjsvKiBlc2xpbnQtZGlzYWJsZSBpbXBvcnQvbm8tZGVmYXVsdC1leHBvcnQgKi9cbmltcG9ydCBiYXNpY1NzbCBmcm9tICdAdml0ZWpzL3BsdWdpbi1iYXNpYy1zc2wnXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXG5pbXBvcnQgeyBsb2FkRW52LCBQcm94eU9wdGlvbnMgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZXN0L2NvbmZpZydcblxuZXhwb3J0IGRlZmF1bHQgKHsgbW9kZSB9OiBVc2VyQ29uZmlnKSA9PiB7XG4gIHByb2Nlc3MuZW52ID0geyAuLi5wcm9jZXNzLmVudiwgLi4ubG9hZEVudihtb2RlID8/ICdkZXZlbG9wbWVudCcsIHByb2Nlc3MuY3dkKCkpIH1cblxuICBjb25zdCBodHRwcyA9IHByb2Nlc3MuZW52LlZJVEVfSFRUUFMgPT09ICd0cnVlJ1xuICBjb25zdCBobXIgPSAhKHByb2Nlc3MuZW52LlZJVEVfSE1SID09PSAnZmFsc2UnKVxuICBjb25zdCBob3N0ID0gcHJvY2Vzcy5lbnYuVklURV9IT1NUID8/ICdsb2NhbGhvc3QnXG4gIGNvbnN0IGhtclByb3RvY29sID0gcHJvY2Vzcy5lbnYuVklURV9XU19QUk9UT0NPTCA/PyBodHRwcyA/ICd3c3MnIDogJ3dzJ1xuXG4gIGNvbnN0IHByb3h5ID0gWydhcGknLCAnc2VydmljZXMnLCAnZmFrZScsICdlcnJvci5qc3AnLCAnbG9nb3V0JywgJ3dlbGNvbWUuaHRtbCcsICdzYW1sJ10ucmVkdWNlPFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IFByb3h5T3B0aW9ucz4+KFxuICAgIChyZXN1bHQsIHJvdXRlKSA9PiAoe1xuICAgICAgLi4ucmVzdWx0LFxuICAgICAgW2AvJHtyb3V0ZX1gXToge1xuICAgICAgICB0YXJnZXQ6IHByb2Nlc3MuZW52LlZJVEVfQVBJX1RBUkdFVCA/PyAnaHR0cHM6Ly9yZWhhYnN0b2QtZGV2dGVzdC5pbnR5Zy5ub3JkaWNtZWR0ZXN0LnNlJyxcbiAgICAgICAgY29va2llRG9tYWluUmV3cml0ZTogeyAnKic6ICcnIH0sXG4gICAgICAgIHByb3RvY29sUmV3cml0ZTogJ2h0dHBzJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBhdXRvUmV3cml0ZTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSksXG4gICAge31cbiAgKVxuXG4gIHJldHVybiBkZWZpbmVDb25maWcoe1xuICAgIHBsdWdpbnM6IFtyZWFjdCgpXS5jb25jYXQoaHR0cHMgPyBbYmFzaWNTc2woKV0gOiBbXSksXG4gICAgc2VydmVyOiB7XG4gICAgICBob3N0LFxuICAgICAgaHR0cHMsXG4gICAgICBwb3J0OiA1MTczLFxuICAgICAgcHJveHksXG4gICAgICBzdHJpY3RQb3J0OiB0cnVlLFxuICAgICAgaG1yOiBobXIgPyB7IGhvc3QsIHByb3RvY29sOiBobXJQcm90b2NvbCB9IDogZmFsc2UsXG4gICAgfSxcbiAgICB0ZXN0OiB7XG4gICAgICBnbG9iYWxzOiB0cnVlLFxuICAgICAgZW52aXJvbm1lbnQ6ICdqc2RvbScsXG4gICAgICBzZXR1cEZpbGVzOiBbJ3NyYy9zZXR1cFRlc3RzLnRzJ10sXG4gICAgICBkZXBzOiB7XG4gICAgICAgIGlubGluZTogWydAaW5lcmEvaWRzLWNvcmUnXSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSlcbn1cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxPQUFPLGNBQWM7QUFDckIsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsZUFBNkI7QUFDdEMsU0FBUyxvQkFBZ0M7QUFFekMsSUFBTyxzQkFBUSxDQUFDLEVBQUUsS0FBSyxNQUFrQjtBQUN2QyxVQUFRLE1BQU0sRUFBRSxHQUFHLFFBQVEsS0FBSyxHQUFHLFFBQVEsUUFBUSxlQUFlLFFBQVEsSUFBSSxDQUFDLEVBQUU7QUFFakYsUUFBTSxRQUFRLFFBQVEsSUFBSSxlQUFlO0FBQ3pDLFFBQU0sTUFBTSxFQUFFLFFBQVEsSUFBSSxhQUFhO0FBQ3ZDLFFBQU0sT0FBTyxRQUFRLElBQUksYUFBYTtBQUN0QyxRQUFNLGNBQWMsUUFBUSxJQUFJLG9CQUFvQixRQUFRLFFBQVE7QUFFcEUsUUFBTSxRQUFRLENBQUMsT0FBTyxZQUFZLFFBQVEsYUFBYSxVQUFVLGdCQUFnQixNQUFNLEVBQUU7QUFBQSxJQUN2RixDQUFDLFFBQVEsV0FBVztBQUFBLE1BQ2xCLEdBQUc7QUFBQSxNQUNILENBQUMsSUFBSSxPQUFPLEdBQUc7QUFBQSxRQUNiLFFBQVEsUUFBUSxJQUFJLG1CQUFtQjtBQUFBLFFBQ3ZDLHFCQUFxQixFQUFFLEtBQUssR0FBRztBQUFBLFFBQy9CLGlCQUFpQjtBQUFBLFFBQ2pCLGNBQWM7QUFBQSxRQUNkLGFBQWE7QUFBQSxNQUNmO0FBQUEsSUFDRjtBQUFBLElBQ0EsQ0FBQztBQUFBLEVBQ0g7QUFFQSxTQUFPLGFBQWE7QUFBQSxJQUNsQixTQUFTLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQUEsSUFDbkQsUUFBUTtBQUFBLE1BQ047QUFBQSxNQUNBO0FBQUEsTUFDQSxNQUFNO0FBQUEsTUFDTjtBQUFBLE1BQ0EsWUFBWTtBQUFBLE1BQ1osS0FBSyxNQUFNLEVBQUUsTUFBTSxVQUFVLFlBQVksSUFBSTtBQUFBLElBQy9DO0FBQUEsSUFDQSxNQUFNO0FBQUEsTUFDSixTQUFTO0FBQUEsTUFDVCxhQUFhO0FBQUEsTUFDYixZQUFZLENBQUMsbUJBQW1CO0FBQUEsTUFDaEMsTUFBTTtBQUFBLFFBQ0osUUFBUSxDQUFDLGlCQUFpQjtBQUFBLE1BQzVCO0FBQUEsSUFDRjtBQUFBLEVBQ0YsQ0FBQztBQUNIOyIsCiAgIm5hbWVzIjogW10KfQo=
