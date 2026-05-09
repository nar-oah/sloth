import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import { initConstants } from "./src/admUI/constants";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: initConstants(),
      },
    },
  },
});
