import { fitBounds } from "@hungpv4564/vue-library-map/helper";
import { getUUIDv4 } from "@/utils";
export class ALayer {
  constructor(info) {
    this.info = Object.assign({ metadata: {} }, info);
    this.layer = info;
    this._id = this.info.id || `${getUUIDv4()}`;
    if (!this.layer.id) {
      this.layer.id = this._id;
    }
    this.views = [];
  }
  addView(...layer_view) {
    this.views.push(...layer_view);
  }
  withView(cb) {
    for (let i = 0; i < this.views.length; i++) cb.bind(this)(this.views[i]);
  }
  runViewWithNameFunction(name_func, ...params) {
    this.withView((view) => {
      if (view[name_func]) {
        view[name_func](this, ...params);
      }
    });
  }
  get id() {
    return this._id;
  }
  get type() {
    return this.info ? this.info.type : "";
  }
  get metadata() {
    return this.info ? this.info.metadata : {};
  }
  getBeforeId() {
    return this.id;
  }
  addToMap(map, beforeId) {
    if (this.beforeAddToMap) {
      this.beforeAddToMap(map, beforeId);
    }
    if (!map.getLayer(this.id)) {
      map.addLayer(this.layer, beforeId);
    }
    this.runViewWithNameFunction("addToMap", map, beforeId);
  }
  removeFromMap(map) {
    if (map.getLayer(this.id)) {
      map.removeLayer(this.id);
    }
    if (map.getSource(this.id)) {
      map.removeSource(this.id);
    }
    this.runViewWithNameFunction("removeFromMap", map);
  }
  moveLayer(map, beforeId) {
    map.moveLayer(this.id, beforeId);
    this.runViewWithNameFunction("moveLayer", map, beforeId);
  }
  flyTo(map, bounds) {
    let layer = this.info;
    if (!bounds && layer.metadata && layer.metadata.bounds) {
      bounds = layer.metadata.bounds;
    }
    if (!bounds) {
      return;
    }

    fitBounds(map, bounds);
    this.runViewWithNameFunction("flyTo", map, bounds);
  }
  toggleShow(map, show) {
    map.setLayoutProperty(
      this.layer.id,
      "visibility",
      show ? "visible" : "none"
    );
    this.runViewWithNameFunction("toggleShow", map, show);
  }
  setOpacity(map, opacity) {
    let keyOpacity =
      this.type == "symbol" ? `icon-opacity` : `${this.type}-opacity`;

    map.setPaintProperty(this.id, keyOpacity, opacity);
    this.runViewWithNameFunction("setOpacity", map, opacity);
  }
}
