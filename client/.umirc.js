export default {
    plugins: [
      ['umi-plugin-dva', { immer: true }],
    ],
    hashHistory:true,
    "proxy": {
      "/nodeApi": {
        "target": "http://localhost:7001/",
        "changeOrigin": true
      }
    },
  };