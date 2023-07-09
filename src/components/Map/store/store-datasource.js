import {
  EVENTBUS_TYPE,
  eventBus,
  store,
  storeMap
} from "@hungpv97/vue-map-store";

import { Layer } from "../model";

const KEY = "datasource_layers";
store.initStore(KEY, () => ({}));

export function initStoreForMap(mapId) {
  if (store.getStore(KEY)[mapId]) {
    return;
  }
  store.getStore(KEY)[mapId] = {};
}
export const removeStoreForMap = (mapId) => {
  delete store.getStore(KEY)[mapId];
};
export async function createLayer(info, mapId, cb_build) {
  let layer = new Layer();
  layer.setInfo(info);
  if (cb_build) {
    let builds = cb_build(layer);
    if (builds && Array.isArray(builds)) {
      builds.forEach((build) => build.setForLayer(layer));
    }
  }
  store.getStore(KEY)[mapId][layer.id] = layer;
  if (layer.canBuildForView("list")) {
    layer.runBuild("list");
    layer.getView("list").index = Object.keys(
      store.getStore(KEY)[mapId]
    ).length;
  }
  if (layer.canBuildForView("source")) {
    layer.runBuild("source");
  }
  if (layer.canBuildForView("map")) {
    layer.runBuild("map");
  }
  if (layer.canBuildForView("identify")) {
    layer.runBuild("identify");
  }
  storeMap.getMap(mapId, async (map) => {
    layer.addToMap(map);
  });
  eventBus.emit(EVENTBUS_TYPE.MAP.SET_LAYER, layer);
  return layer;
}
export function removeLayer(mapId, layer) {
  const store_layers = store.getStore(KEY)[mapId];
  storeMap.getMap(mapId, async (map) => {
    layer.removeFromMap(map);
  });
  delete store_layers[layer.id];
  eventBus.emit(EVENTBUS_TYPE.MAP.REMOVE_LAYER, layer);
}
export function getAllViewForKey(mapId, key) {
  let views = [];

  for (const layer_id in store.getStore(KEY)[mapId]) {
    let layer = store.getStore(KEY)[mapId][layer_id];
    if (layer.canBuildForView(key)) {
      let view = layer.getView(key);
      if (view) views.push(view);
    }
  }

  return views;
}

storeMap.initForMap(initStoreForMap, removeStoreForMap);
