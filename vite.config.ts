import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  console.log("🔑 API Keys loaded:");
  console.log("Client ID:", env.VITE_NAVER_CLIENT_ID);
  console.log(
    "Client Secret:",
    env.VITE_NAVER_CLIENT_SECRET ? "✓ (exists)" : "✗ (missing)"
  );

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api/geocode": {
          target: "https://naveropenapi.apigw.ntruss.com",
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(/^\/api\/geocode/, "/map-geocode/v2/geocode"),
          configure: (proxy) => {
            proxy.on("proxyReq", (proxyReq, req) => {
              console.log("📡 Proxying request:", req.url);
              console.log("   Headers being sent:");
              console.log(
                "   - x-ncp-apigw-api-key-id:",
                env.VITE_NAVER_CLIENT_ID
              );
              console.log(
                "   - x-ncp-apigw-api-key:",
                env.VITE_NAVER_CLIENT_SECRET ? "✓" : "✗"
              );

              proxyReq.setHeader(
                "x-ncp-apigw-api-key-id",
                env.VITE_NAVER_CLIENT_ID || ""
              );
              proxyReq.setHeader(
                "x-ncp-apigw-api-key",
                env.VITE_NAVER_CLIENT_SECRET || ""
              );
              proxyReq.setHeader("Accept", "application/json");
            });

            proxy.on("proxyRes", (proxyRes, req) => {
              console.log("📥 Response:", proxyRes.statusCode, req.url);
            });
          },
        },
      },
    },
  };
});
