import { MapMultiLayer, MapSingleLayer } from "../view/map";

import { ABuild } from "./_default";

export class LayerMapBuild extends ABuild {
  constructor(option = {}) {
    super("map", option);
  }
  setLayers(layers) {
    if (!this.build) this.setBuild((_, option) => new MapMultiLayer(option));
    this.option.layers = layers;
    return this;
  }
  setLayer(layer) {
    if (!this.build) this.setBuild((_, option) => new MapSingleLayer(option));
    this.option.layer = Object.assign({ layout: {}, paint: {} }, layer);
    return this;
  }
  setSource(source) {
    this.option.source = source;
    return this;
  }
}
