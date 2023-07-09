import { AView } from "../view";
/* eslint-disable no-unused-vars */
import { getUUIDv4 } from "@/utils/uuid";

export class ALayer extends AView {
  constructor(info) {
    super();
    this.info = Object.assign({ metadata: {} }, info);
    this._id = this.info.id || `${getUUIDv4()}`;
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
    throw new Error("Class not implement 'addToMap' method");
  }
  removeFromMap(map) {
    throw new Error("Class not implement 'removeFromMap' method");
  }
  moveLayer(map, beforeId) {
    throw new Error("Class not implement 'moveLayer' method");
  }
  toggleShow(map, show) {
    throw new Error("Class not implement 'toggleShow' method");
  }
  setOpacity(map, opacity) {
    throw new Error("Class not implement 'setOpacity' method");
  }
}
