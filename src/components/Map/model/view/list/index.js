import { getUUIDv4 } from "@/utils/uuid";

export function createDefaultViewInList(layer, option = {}) {
  if (!layer.metadata) {
    layer.metadata = {};
  }
  let show = option.show != null ? option.show : true;
  let opacity = option.opacity != null ? option.opacity : 1;
  let parent = null;
  let temp = {
    setParent(_parent) {
      parent = _parent;
    },
    get parent() {
      return parent;
    },
    id: layer.id || getUUIDv4(),
    name: layer.name,
    show,
    opacity,
    get menus() {
      return option.menus || [];
    },
    get extra_buttons() {
      return option.extra_buttons || [];
    },
    selected: false,
    get metadata() {
      return layer.metadata;
    },
    set metadata(value) {
      layer.metadata = value;
    },
    color: option.color || "#38d4ff",
    config: {
      disable_delete: false,
      disabled_opacity: false,
      component: "layer-item"
    },
    multi: false
  };
  if (option.group) {
    temp.group = option.group;
  }
  if (option.disable_delete) {
    temp.config.disable_delete = option.disable_delete;
  }

  if (option.disabled_opacity) {
    temp.config.disabled_opacity = option.disabled_opacity;
  }

  return temp;
}

export function createDefaultCompareViewInList(layer, option, maps = []) {
  let res = createDefaultViewInList(layer);
  let show = maps.map(() => (option.show != null ? option.show : true));
  res.config.component = "layer-item-compare";
  res.multi = true;
  res.show = show;

  return res;
}
export function convertToCompareViewInList(layer, maps = []) {
  let show = maps.map(() => (layer.show != null ? layer.show : true));
  layer.config.component = "layer-item-compare";
  layer.multi = true;
  layer.show = show;

  return layer;
}

export function convertToSingleViewInList(layer) {
  let show = layer.show;
  if (Array.isArray(layer.show)) {
    show = layer.show.some((x) => x);
  }
  layer.config.component = "layer-item";
  layer.multi = false;
  layer.show = show;

  return layer;
}
