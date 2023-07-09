export class ABuild {
  constructor(key, option = {}, default_option = {}) {
    this.key = key;
    this.option = Object.assign({}, default_option, option);
  }
  setBuild(build) {
    this.build = build;
    return this;
  }
  setForLayer(layer) {
    layer.setBuild(this.key, this.build, this.option);
    return this;
  }
}
