<template>
  <div id="app">
    <Map @map-loaded="onMapLoad">
      <BaseMapControl position="bottom-left" />
      <PrintControl />
      <GeolocateControl />
      <HomeControl />
      <ZoomControl />

      <FullScreenControl />
      <MouseCoordinatesControl />
      <LayerControl position="top-left" ref="LayerControl" />
    </Map>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import {
  FullScreenControl,
  MouseCoordinatesControl,
  ZoomControl,
  HomeControl,
  GeolocateControl,
  BaseMapControl,
  Map,
  PrintControl
} from "@hungpv4564/vue-library-map";
import "@hungpv4564/vue-library-map/main.css";
import { LayerControl } from "@/components";
import { createDefaultView } from "./model/view";
import { getUUIDv4 } from "./utils";
import { createDefaultData } from "./model/data";
export default {
  name: "App",
  components: {
    FullScreenControl,
    MouseCoordinatesControl,
    ZoomControl,
    HomeControl,
    GeolocateControl,
    BaseMapControl,
    Map,
    PrintControl,
    LayerControl
  },
  methods: {
    onMapLoad() {
      this.$nextTick(() => {
        this.$refs.LayerControl.addLayer({
          id: getUUIDv4(),
          name: "arcgisonline",
          group: { name: "test", id: "test" },
          layer: {
            type: "raster",
            source: {
              type: "raster",
              tiles: [
                "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              ]
            }
          },
          menus: [],
          metadata: {
            loading: false
          }
        });
        this.$refs.LayerControl.addLayer({
          id: getUUIDv4(),
          name: "openstreetmap",
          group: { name: "test", id: "test" },
          layer: {
            type: "raster",
            source: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"]
            }
          },
          menus: [],
          metadata: {
            loading: false
          }
        });
        this.$refs.LayerControl.addLayer({
          id: getUUIDv4(),
          name: "naturalearthtiles",
          layer: {
            type: "raster",
            source: {
              type: "raster",
              tiles: [
                "https://naturalearthtiles.roblabs.com/tiles/natural_earth_cross_blended_hypso_shaded_relief.raster/{z}/{x}/{y}.png"
              ]
            }
          },
          menus: [],
          metadata: {
            loading: false
          }
        });
        this.$refs.LayerControl.addLayer({
          id: getUUIDv4(),
          name: "Stamen terrain",
          layer: {
            type: "raster",
            source: {
              type: "raster",
              tiles: [
                "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
              ]
            }
          },
          menus: [],
          metadata: {
            loading: false
          }
        });
      });
    }
  }
};
</script>
<style>
* {
  padding: 0;
  margin: 0;
}

body,
html,
#app {
  height: 100%;
}
</style>
