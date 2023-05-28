const path = require("path");
function getProdExternals() {
  return {
    "@hungpv4564/vue-library-map": "@hungpv4564/vue-library-map",
    vue: "vue",
    lodash: "lodash",
    vuedraggable: "vuedraggable"
  };
}
module.exports = {
  productionSourceMap: false,
  transpileDependencies: true,
  configureWebpack: {
    devtool: "source-map",
    resolve: {
      alias: {
        "@components": path.join(__dirname, "src/components/"),
        "@constant": path.join(__dirname, "src/constant/"),
        "@utils": path.join(__dirname, "src/utils/"),
        "@app.config": path.join(__dirname, "src/app.config.json")
      }
    },
    externals: process.env.NODE_ENV === "production" ? getProdExternals() : {}
  }
};
