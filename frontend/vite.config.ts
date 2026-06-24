import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "image-proxy",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = new URL(req.url || "", "http://localhost");
          if (!url.pathname.startsWith("/image-proxy/")) {
            next();
            return;
          }

          const imageUrl = url.searchParams.get("url");
          if (!imageUrl) {
            res.statusCode = 400;
            res.end('Missing "url" parameter');
            return;
          }

          try {
            const response = await fetch(imageUrl);
            if (!response.ok) {
              res.statusCode = response.status;
              res.end(`Failed to fetch image: ${response.statusText}`);
              return;
            }

            const arrayBuffer = await response.arrayBuffer();
            const contentType =
              response.headers.get("content-type") || "image/jpeg";

            res.writeHead(200, {
              "Content-Type": contentType,
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "public, max-age=86400",
            });
            res.end(Buffer.from(arrayBuffer));
          } catch {
            res.statusCode = 502;
            res.end("Failed to proxy image");
          }
        });
      },
    },
  ],
  server: {
    watch: {
      usePolling: true,
    },
  },
  assetsInclude: ["**/*.svg"],
});
