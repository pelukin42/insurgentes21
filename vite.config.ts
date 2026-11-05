import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// GITHUB_PAGES=true builds for https://pelukin42.github.io/insurgentes21/
export default defineConfig({
  base: process.env.GITHUB_PAGES ? "/insurgentes21/" : "/",
  plugins: [react()],
});
