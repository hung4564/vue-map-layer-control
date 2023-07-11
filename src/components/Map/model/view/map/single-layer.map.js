import { ALayer } from "./ALayer";
export class MapSingleLayer extends ALayer {
  constructor(info) {
    super(info);
    this.layer = info.layer;
    this.source = info.source;
    if (!this.layer.id) {
      this.layer.id = this._id;
    }
    if (this.source && !this.source.id) {
      this.source.id = this._id;
    }
  }
  getBeforeId() {
    return this.layer.id;
  }
  getAllLayerIds() {
    return [this.layer.id];
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
    if (!this.layer.source && source_id) {
      this.layer.source = source_id;
    }
    if (!map.getLayer(this.layer.id)) {
      map.addLayer(this.layer, beforeId);
    }
  }
  removeFromMap(map) {
    if (map.getLayer(this.layer.id)) {
      map.removeLayer(this.layer.id);
    }
    if (map.getSource(this.layer.id)) {
      map.removeSource(this.layer.id);
    }
    if (this.source && map.getSource(this.source.id)) {
      map.removeSource(this.source.id);
    }
  }
  moveLayer(map, beforeId) {
    map.moveLayer(this.layer.id, beforeId);
  }
  toggleShow(map, show) {
    map.setLayoutProperty(
      this.layer.id,
      "visibility",
      show ? "visible" : "none"
    );
  }
  setOpacity(map, opacity) {
    let keyOpacity =
      this.type == "symbol" ? `icon-opacity` : `${this.type}-opacity`;

    map.setPaintProperty(this.layer.id, keyOpacity, opacity);
  }
}
