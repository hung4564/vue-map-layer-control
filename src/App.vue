<template>
  <div id="app">
    <Map @map-loaded="onMapLoaded">
      <LayerControl position="top-left" />
      <GeolocateControl />
      <HomeControl />
      <ZoomControl />

      <FullScreenControl />
      <BaseMapControl position="bottom-left" />
      <MouseCoordinatesControl />
      <IdentifyControl position="top-right" />
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
  Map
} from "@hungpv97/vue-library-map";
import "@hungpv97/vue-library-map/main.css";
import { LayerControl, IdentifyControl } from "@map";
import { createLayer } from "@map/store/store-datasource";
import {
  LayerListBuild,
  LayerSourceBuild,
  LayerMapBuild,
  LayerIdentifyBuild
} from "@map/model";
import { GeoJsonSourceBuild, RasterSourceBuild } from "@map/model/view/source";
import { mdiHome } from "@mdi/js";
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
    LayerControl,
    IdentifyControl
  },
  methods: {
    async onMapLoaded(map) {
      createLayer(
        {
          name: "Stamen watercolor"
        },
        map.id,
        (layer) => {
          let builds = [
            new LayerListBuild().disableOpacity().forMap(map.id),
            new LayerSourceBuild(new RasterSourceBuild()).setTiles([
              "https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg"
            ]),
            new LayerMapBuild().setLayer({
              type: "raster"
            })
          ];

          return builds;
        }
      );
      createLayer(
        {
          name: "test 2"
        },
        map.id,
        (layer) => {
          let color = "#34495e";
          let builds = [
            new LayerListBuild().setColor(color).forMap(map.id),
            new LayerSourceBuild(new GeoJsonSourceBuild()).setData({
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    id: "1",
                    name: "feature 2"
                  },
                  geometry: {
                    coordinates: [
                      [
                        [104.96327341667353, 19.549518287564368],
                        [104.96327341667353, 18.461221184685627],
                        [106.65936430823979, 18.461221184685627],
                        [106.65936430823979, 19.549518287564368],
                        [104.96327341667353, 19.549518287564368]
                      ]
                    ],
                    type: "Polygon"
                  }
                }
              ]
            }),
            new LayerMapBuild().setLayers([
              {
                type: "fill", // For fill
                paint: {
                  "fill-color": color,
                  "fill-opacity": 1
                }
              },
              {
                type: "line", // For outline
                paint: {
                  "line-color": color,
                  "line-width": 2
                }
              }
            ]),
            new LayerIdentifyBuild()
          ];

          return builds;
        }
      );
      createLayer(
        {
          name: "test 3"
        },
        map.id,
        (layer) => {
          let color = "#F85E00";
          let builds = [
            new LayerListBuild()
              .setColor(color)
              .disableOpacity()
              .forMap(map.id),
            new LayerSourceBuild(new GeoJsonSourceBuild()).setData({
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  properties: {
                    id: "1",
                    name: "feature 1"
                  },
                  geometry: {
                    coordinates: [
                      [
                        [105.24219817631774, 20.22109590156704],
                        [105.24219817631774, 18.332345570422945],
                        [105.9212676811336, 18.332345570422945],
                        [105.9212676811336, 20.22109590156704],
                        [105.24219817631774, 20.22109590156704]
                      ]
                    ],
                    type: "Polygon"
                  }
                }
              ]
            }),
            new LayerMapBuild().setLayers([
              {
                type: "fill", // For fill
                paint: {
                  "fill-color": color,
                  "fill-opacity": 1
                }
              },
              {
                type: "line", // For outline
                paint: {
                  "line-color": color,
                  "line-width": 2
                }
              }
            ]),
            new LayerIdentifyBuild()
          ];
          return builds;
        }
      );
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
