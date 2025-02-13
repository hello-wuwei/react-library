# Ant Design 兼容

如果專案有使用 Ant Design 並且也有多版本並存的情況，請做以下修改：

1. `package.json` 同步版本

```json
{
  "overrides": {
    "@mx-admin/*": {
      "antd": "$antd4"
    }
  }
}
```

2. umirc 修改 webpack 內容：

```js
import { NormalModuleReplacementPlugin } from 'webpack';

export default {
  // ...
  chainWebpack: (config) => {
    // ...
    config.module
      .rule('antd4')
      .test(/\.less$/)
      .include.add(path.resolve(__dirname, 'node_modules', 'antd4'))
      .add(path.resolve(__dirname, 'node_modules', '@mx-admin'))
      .end()
      .use()
      .loader('less-loader')
      .options({
        javascriptEnabled: true,
        modifyVars: {
          '@ant-prefix': 'antd4',
        },
      });

    config.plugin('mx-admin-antd-resolve').use(NormalModuleReplacementPlugin, [
      /antd/,
      (resource) => {
        if (['node_modules', '@mx-admin'].every((path) => !!~resource.context.indexOf(path))) {
          const requestPaths = resource.request.split('/');

          resource.request = requestPaths
            .map((p) => {
              if (p === 'antd') return 'antd4';

              return p;
            })
            .join('/');
        }
      },
    ]);
  },
};
```
