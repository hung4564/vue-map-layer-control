import { getUUIDv4 } from "@/utils/uuid";
export class Base {
  get id() {
    return this._id;
  }
  constructor() {
    this._id = `${getUUIDv4()}`;
  }
}
export class Layer extends Base {
  constructor() {
    super();
    this.info = { metadata: {} };
    this._view = new LayerViewContainer(this._id);
    this._build = new LayerBuildContainer(this._id);
    this._map = new LayerMapContainer(this._id);
    return this.asProxy();
  }
  get metadata() {
    return this.info.metadata;
  }
  get name() {
    return this.info.name;
  }
  asProxy() {
    let handler = {
      get: function (target, prop) {
        if (target[prop] != null) {
          return target[prop];
        }
        return function wrapper() {
          let args = Array.prototype.slice.call(arguments);
          return target._view.runWithNameFunction(prop, ...args);
        };
      }
    };

    return new Proxy(this, handler);
  }
  isHasMap(map) {
    return this._map.isHas(map.id);
  }
  addToMap(map) {
    this._map.add(map.id);
    let args = Array.prototype.slice.call(arguments);
    return this._view.runWithNameFunction("addToMap", ...args);
  }
  removeFromMap(map) {
    this._map.remove(map.id);
    let args = Array.prototype.slice.call(arguments);
    return this._view.runWithNameFunction("removeFromMap", ...args);
  }
  setInfo(info) {
    if (info.metadata == null) {
      info.metadata = {
        loading: false
      };
    } else {
      if (info.metadata.loading == null) {
        info.metadata.loading = false;
      }
    }
    this.info = info;
    return this;
  }
  setBuild(key, build, option = {}) {
    return this._build.set(key, build, option);
  }
  canBuildForView(key = "") {
    return this._build.canForView(key);
  }
  setView(...args) {
    return this._view.add(...args);
  }
  getView(key = "") {
    return this._view.get(key);
  }
  runBuild(key) {
    if (!this._build.canForView(key)) {
      return;
    }
    this._view.add(key, this._build.build(key, this));
    return this;
  }
}
class LayerPartContainer {}
class LayerMapContainer extends LayerPartContainer {
  constructor(id) {
    super(id);
    this.map_id = "";
    this.sub_map_ids = [];
  }
  isHas(map_id) {
    return this.sub_map_ids.includes(map_id);
  }
  add(map_id) {
    if (map_id && !this.sub_map_ids.includes(map_id)) {
      this.sub_map_ids.push(map_id);
    }
    return this;
  }
  remove(map_id) {
    if (map_id && this.sub_map_ids.includes(map_id)) {
      let index = this.sub_map_ids.indexOf(map_id);
      if (index !== -1) {
        this.sub_map_ids.splice(index, 1);
      }
    }
    return this;
  }
}
class LayerViewContainer extends LayerPartContainer {
  views = {};
  add(key = "", view = {}) {
    this.views[key] = view;
    return this;
  }
  get(key = "") {
    return this.views[key];
  }
  runWithNameFunction(name_func, ...params) {
    let promises = [];
    withViews(
      this.views,
      (view) => {
        if (view[name_func]) {
          promises.push(view[name_func](...params));
        }
      },
      this
    );

    return Promise.all(promises);
  }
}
class LayerBuildContainer extends LayerPartContainer {
  builds = {};
  set(key = "", build = () => {}, option = {}) {
    this.builds[key] = [build, option];
    return this;
  }
  build(key = "", layer = {}) {
    const [build, option] = this.builds[key];
    const res = build(layer, option);
    res.setParent(layer);
    return res;
  }
  canForView(key = "") {
    if (!key) {
      return false;
    }
    return !!this.builds[key];
  }
}
function withViews(views = {}, cb = () => {}, bind = null) {
  if (!bind) {
    bind = this;
  }
  for (const key in views) {
    if (Object.hasOwnProperty.call(views, key)) {
      cb.bind(bind)(views[key]);
    }
  }
}
