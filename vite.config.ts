import { ConfigEnv, defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
// import legacy from '@vitejs/plugin-legacy'

// https://vitejs.dev/config/
export default defineConfig((mode: ConfigEnv) => {
  return {
    base: "./",
    plugins: [
      uni(),
      // legacy({
      //   targets: ['defaults', 'ie >= 11', 'chrome 52'],
      //   additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      //   renderLegacyChunks: true,
      //   polyfills: [
      //     'es.symbol',
      //     'es.array.filter',
      //     'es.promise',
      //     'es.promise.finally',
      //     'es/map',
      //     'es/set',
      //     'es.array.for-each',
      //     'es.object.define-properties',
      //     'es.object.define-property',
      //     'es.object.get-own-property-descriptor',
      //     'es.object.get-own-property-descriptors',
      //     'es.object.keys',
      //     'es.object.to-string',
      //     'web.dom-collections.for-each',
      //     'esnext.global-this',
      //     'esnext.string.match-all'
      //   ]
      // })
    ],
  }
});
