import { ABuild } from "./_default";

export class LayerSourceBuild extends ABuild {
  constructor(build, option = {}) {
    super("source", option);
    this.build = build;
    return this.asProxy();
  }
  asProxy() {
    let handler = {
      get: function (target, prop) {
        if (target[prop] != null) {
          return target[prop];
        }
        return function wrapper() {
          let args = Array.prototype.slice.call(arguments);
          target.build[prop](...args);
          return target;
        };
      }
    };

    return new Proxy(this, handler);
  }
  setForLayer(layer) {
    layer.setBuild(this.key, this.build.build(), this.option);
    return this;
  }
}
