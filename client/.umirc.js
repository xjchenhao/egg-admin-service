export default {
  plugins: [
    [
      'umi-plugin-react',
      {
        dva: true,
        antd: true,
        routes: {
          exclude: [
            /model\.(j|t)sx?$/,
            /service\.(j|t)sx?$/,
            /models\//,
            /components\//,
            /services\//,
            /utils\//,
          ],
        },
        dll: {
          exclude: [],
          include: ["dva", "dva/router", "dva/saga", "dva/fetch", "antd/es"],
        },
        hardSource: /* isMac */process.platform === 'darwin',
      }
    ],
  ],
  hash: true,
  ignoreMomentLocale: true,
  browserslist: [
    "> 1%",
    "last 2 versions",
    "iOS 7"
  ],
  "proxy": {
    "/nodeApi": {
      "target": "http://localhost:7001/",
      "changeOrigin": true
    }
  },
};