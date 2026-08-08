import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "src/index.html"),
        drivers: resolve(import.meta.dirname, "src/drivers.html"),
        teams: resolve(import.meta.dirname, "src/teams.html"),
        newsletter: resolve(import.meta.dirname, "src/newsletter.html"),
        siteplan: resolve(import.meta.dirname, "src/siteplan.html"),
        thankyou: resolve(import.meta.dirname, "src/thank-you.html"),
      }
    }
  }
});