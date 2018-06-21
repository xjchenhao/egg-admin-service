export default {
    plugins: [
      ['umi-plugin-dva', { immer: false }],
    ],
    hashHistory:true,
    "proxy": {
      "/nodeApi": {
        "target": "http://localhost:7001/",
        "changeOrigin": true
      }
    },
  };