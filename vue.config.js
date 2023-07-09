const path = require("path");
function getProdExternals() {
  return {
    vuedraggable: "vuedraggable",
    "v-click-outside": "v-click-outside",
    "@hungpv97/vue-library-map": "@hungpv97/vue-library-map",
    "@hungpv97/vue-map-store": "@hungpv97/vue-map-store",
    "@hungpv97/vue-library-draggable": "@hungpv97/vue-library-draggable",
    "@jamescoyle/vue-icon": "@jamescoyle/vue-icon",
    "@turf/bbox": "@turf/bbox",
    axios: "axios",
    "mapbox-gl": "mapbox-gl",
    "@mdi/js": "@mdi/js",
    vue: "vue",
    lodash: "lodash",
    "lodash.get": "lodash.get",
    "lodash.set": "lodash.set",
    papaparse: "papaparse",
    mitt: "mitt"
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
        "@map": path.join(__dirname, "src/components/Map/"),
        "@constant": path.join(__dirname, "src/constant/"),
        "@utils": path.join(__dirname, "src/utils/"),
        "@app.config": path.join(__dirname, "src/app.config.json")
      }
    },
    externals: process.env.NODE_ENV === "production" ? getProdExternals() : {}
  }
};
