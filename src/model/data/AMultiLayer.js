import { ALayer } from "./ALayer";

export class AMultiLayer extends ALayer {
  constructor(info) {
    super(info);
    delete this.layer;
    this.layers = [];
    this.source = {};
  }
  getBeforeId() {
    return this.layers[0].id;
  }
  addToMap(map, beforeId) {
    if (this.beforeAddToMap) {
      this.beforeAddToMap(map, beforeId);
    }
    if (!map.getSource(this.source.id)) {
      map.addSource(this.source.id, this.source.data);
    }
    this.layers.forEach((layer) => {
      if (!map.getLayer(layer.id)) {
        map.addLayer(layer, beforeId);
      }
    });
    this.runViewWithNameFunction("addToMap", map, beforeId);
  }
  removeFromMap(map) {
    this.layers.forEach((layer) => {
      if (map.getLayer(layer.id)) {
        map.removeLayer(layer.id);
      }
    });
    if (map.getSource(this.source.id)) {
      map.removeSource(this.source.id);
    }
    this.runViewWithNameFunction("removeFromMap", map);
  }
  moveLayer(map, beforeId) {
    this.layers.forEach((layer) => {
      if (map.getLayer(layer.id)) {
        map.moveLayer(layer.i, beforeId);
      }
    });
    this.runViewWithNameFunction("moveLayer", map, beforeId);
  }
  toggleShow(map, show) {
    this.layers.forEach((layer) => {
      if (map.getLayer(layer.id)) {
        map.setLayoutProperty(
          layer.id,
          "visibility",
          show ? "visible" : "none"
        );
      }
    });
    this.runViewWithNameFunction("toggleShow", map, show);
  }
  setOpacity(map, opacity) {
    this.layers.forEach((layer) => {
      if (map.getLayer(layer.id)) {
        let keyOpacity =
          layer.type == "symbol" ? `icon-opacity` : `${layer.type}-opacity`;

        map.setPaintProperty(layer.id, keyOpacity, opacity);
      }
    });
    this.runViewWithNameFunction("setOpacity", map, opacity);
  }
}
