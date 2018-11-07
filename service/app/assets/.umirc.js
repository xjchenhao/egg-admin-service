
// ref: https://umijs.org/config/
export default {
  history: 'hash',
  hash: true,
  outputPath: '../public/pages',
  "manifest": {
    "fileName": "../../../config/manifest.json",
    publicPath: 'pages/',
  },
  publicPath: '/public/pages/',
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
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
      // dll: {
      //   exclude: [],
      //   include: ["dva", "dva/router", "dva/saga", "dva/fetch", "antd/es"],
      // },
      dll: false,
      dynamicImport: false,
      title: 'assets',
      hardSource: /* isMac */process.platform === 'darwin',
    }],
  ],
}
