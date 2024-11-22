import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    port: 5173, // Set the port for the Vite dev server
    proxy: {
      // Proxying API requests to your backend server
      "/api": {
        target: "http://localhost:3000", // Change to your backend URL
        changeOrigin: true, // For virtual hosted sites
        secure: false, // If you're using http, set to false
      },
      "/socket.io": {
        target: "http://localhost:3000", // Proxy WebSocket requests
        ws: true, // Enable WebSocket support
        changeOrigin: true,
      },
    },
  },
});
