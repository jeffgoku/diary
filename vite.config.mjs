import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
  },
  server: {
    proxy: {
      '/portal': {
        target: "http://diary.server.h",
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/portal/, ''),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log(
              "Sending Request:",
              req.method,
              req.url,
              " => TO THE TARGET => ",
              proxyReq.method,
              proxyReq.protocol + '//' + proxyReq.host + proxyReq.path,
              //JSON.stringify(proxyReq.getHeaders()),
            );
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url,
              //JSON.stringify(proxyRes.headers),
            );
          });
        },
      }
    }
  },
})
