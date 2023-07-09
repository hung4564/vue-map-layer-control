import { Base } from "../Layer";

export class AView extends Base {
  parent = null;
  setParent(_parent) {
    this.parent = _parent;
    this.data_id = _parent.id;
    if (this.runAfterSetParent) {
      this.runAfterSetParent();
    }
  }
}
