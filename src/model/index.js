import Vue from "vue";
import { createDefaultData } from "./data";
import { createDefaultView } from "./view";
if (!Vue.prototype.$_map_layer_control_store) {
  Vue.prototype.$_map_layer_control_store = {};
}
function getStore() {
  return Vue.prototype.$_map_layer_control_store;
}
export function createLayer(map, layer) {
  if (layer.metadata == null) {
    layer.metadata = {
      loading: false,
      bounds: null
    };
  }
  if (layer.metadata.loading == null) {
    layer.metadata.loading = false;
  }
  if (layer.metadata.bounds == null) {
    layer.metadata.bounds = null;
  }
  let createView = (info) => {
    return createDefaultView(info);
  };
  if (layer.createView) {
    createView = layer.createView;
  }
  let createData = (info) => {
    return new createDefaultData(info.layer);
  };
  if (layer.createData) {
    createData = layer.createData;
  }
  let temp = createData(layer);
  getStore()[temp.id] = temp;

  layer.data_id = temp.id;
  let layer_view = createView(layer);
  layer_view.data_id = temp.id;
  temp.addView(layer_view);
  if (layer.views && layer.views.length > 0) temp.addView(...layer.views);
  temp.addToMap(map);

  return layer_view;
}

export function toggleLayerShow(map, layer_view) {
  let temp = getStore()[layer_view.data_id];
  if (!temp) return;
  temp.toggleShow(map, layer_view.show);
}
export function updateLayerSimple(map, layer) {
  let temp = getStore()[layer.data_id];
  if (!temp) return;
  temp.toggleShow(map, layer.show);
  temp.setOpacity(map, layer.opacity);
}
export function toggleShow(map, layer) {
  let temp = getStore()[layer.data_id];
  if (!temp) return;
  temp.toggleShow(map, layer.show);
}
export function updateLayerStyle(map, layer) {
  let temp = getStore()[layer.data_id];
  if (!temp) return;
  temp.setStyle(map, layer.style);
}

export function removeLayer(map, layer) {
  let temp = getStore()[layer.data_id];
  getStore()[layer.data_id] = undefined;
  if (!temp) return;
  temp.removeFromMap(map);
}
export function getLayerData(layer) {
  return getStore()[layer.data_id];
}
export * from "./data";
export * from "./view";
