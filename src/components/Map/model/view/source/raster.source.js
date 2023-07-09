import { ASource } from "./ASource";

export class RasterSource extends ASource {
  constructor(option = {}) {
    super();
    this.option = option;
    if (this.option.bounds) {
      this.setBounds(this.option.bounds);
    }
  }
  getMapboxSource() {
    return {
      type: "raster",
      bounds: this.bounds || [-180, -85.051129, 180, 85.051129],
      maxzoom: this.option.maxzoom || 22,
      minzoom: this.option.minzoom || 0,
      scheme: this.option.scheme || "xyz",
      tiles: this.option.tiles || [],
      tileSize: this.option.tileSize || 512
    };
  }
}

export class RasterSourceBuild {
  option = {};
  setTiles(tiles) {
    this.option.tiles = tiles;
  }
  setMaxzoom(maxzoom) {
    this.option.maxzoom = maxzoom;
  }
  setMinzoom(minzoom) {
    this.option.minzoom = minzoom;
  }
  setScheme(scheme) {
    this.option.scheme = scheme;
  }
  setTileSize(tileSize) {
    this.option.tileSize = tileSize;
  }
  setBounds(bounds) {
    this.option.bounds = bounds;
  }
  build() {
    return () => new RasterSource(this.option);
  }
}
