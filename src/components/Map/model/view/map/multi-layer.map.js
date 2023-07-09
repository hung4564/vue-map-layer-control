import { ALayer } from "./ALayer";

export class MapMultiLayer extends ALayer {
  constructor(info) {
    super(info);
    this.layers = info.layers;
    this.source = info.source;
    this.layers.forEach((layer, id) => {
      if (!layer.id) {
        layer.id = `${this._id}-${id}`;
      }
    });
    if (this.source && !this.source.id) {
      this.source.id = this._id;
    }
  }
  getBeforeId() {
    return this.layers[0].id;
  }
  addToMap(map, beforeId) {
    let view_source = this.parent.getView("source");
    let source_id = view_source ? view_source.id : null;
    if (!this.source || !this.source.data) {
      this.source = {
        id: source_id,
        data: view_source.getMapboxSource()
      };
    }
    if (this.source && !map.getSource(this.source.id)) {
      map.addSource(this.source.id, this.source.data);
    }
    this.layers.forEach((layer) => {
      if (!map.getLayer(layer.id)) {
        if (!layer.source && this.source) {
          layer.source = this.source.id;
        }
        if (!layer.source && source_id) {
          layer.source = source_id;
        }
        map.addLayer(layer, beforeId);
      }
    });
  }
  removeFromMap(map) {
    this.layers.forEach((layer) => {
      if (map.getLayer(layer.id)) {
        map.removeLayer(layer.id);
      }
    });
    if (this.source && map.getSource(this.source.id)) {
      map.removeSource(this.source.id);
    }
  }
  moveLayer(map, beforeId) {
    this.layers.forEach((layer) => {
      if (map.getLayer(layer.id)) {
        map.moveLayer(layer.id, beforeId);
      }
    });
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
  }
  setOpacity(map, opacity) {
    this.layers.forEach((layer) => {
      if (map.getLayer(layer.id)) {
        let keyOpacity =
          layer.type == "symbol" ? `icon-opacity` : `${layer.type}-opacity`;

        map.setPaintProperty(layer.id, keyOpacity, opacity);
      }
    });
  }
}
