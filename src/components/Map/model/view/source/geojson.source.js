import { ASource } from "./ASource";
import bbox from "@turf/bbox";
export class GeoJsonSource extends ASource {
  constructor(geojson = {}) {
    super();
    this.setData(geojson);
  }
  setData(data = {}) {
    this.geojson = data;
    this.setBounds(bbox(data));
  }
  runAfterSetParent() {
    if (this.bounds) {
      this.parent.metadata.bounds = this.bounds;
    }
  }
  setBounds(bounds) {
    this.bounds = bounds;
    if (this.parent) {
      this.parent.metadata.bounds = bounds;
    }
  }
  getMapboxSource() {
    return {
      type: "geojson",
      data: this.geojson
    };
  }
}
export class GeoJsonSourceBuild {
  setData(geojson) {
    this.geojson = geojson;
    return this;
  }
  build() {
    return (_, option) => new GeoJsonSource(this.geojson, option);
  }
}
