import { createSSRApp } from "vue";
import App from "./App.vue";
import uviewPlus from 'uview-plus'
import { setupStore } from '@/store';

export function createApp() {
  const app = createSSRApp(App);
  app.use(uviewPlus)
  setupStore(app);
  return {
    app,
  };
}