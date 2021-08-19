
A workaround for vite.config.js#esbuild.jsxInject option, which is going to be deprecated in the future.

```js
// vite.config.js
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`
  }
})
// =>
// vite.config.js
import jsxInject from 'vite-plugin-jsx-inject'
export default defineConfig({
  plugins: [jsxInject(`import React from 'react'`)]
})
```
