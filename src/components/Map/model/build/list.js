import {
  createDefaultCompareViewInList,
  createDefaultViewInList
} from "../view/list";

import { ABuild } from "./_default";
import { storeMap } from "@hungpv97/vue-map-store";

export class LayerListBuild extends ABuild {
  constructor(option = {}) {
    super("list", option, { show: true, opacity: 1 });
    this.setBuild(createDefaultViewInList);
  }
  disableDelete() {
    this.option.disable_delete = true;
    return this;
  }
  disableOpacity() {
    this.option.disabled_opacity = true;
    return this;
  }
  setColor(color) {
    this.option.color = color;
    return this;
  }
  setGroup(group) {
    this.option.group = group;
    return this;
  }
  setMenus(menus) {
    this.option.menus = menus;
    return this;
  }
  setButton(menus) {
    this.option.extra_buttons = menus;
    return this;
  }
  forMap(mapId) {
    let map = storeMap.getMap(mapId);
    if (map && map.length > 1) {
      this.setBuild((...args) => createDefaultCompareViewInList(...args, map));
    }
    return this;
  }
  setForLayer(layer) {
    layer.setBuild("list", this.build, this.option);
    return this;
  }
}
