import { AView } from "../view";

export class ASource extends AView {
  constructor() {
    super();
    this.headers = [];
    this.bounds = [-180, -85.051129, 180, 85.051129];
  }
  setBounds(bounds) {
    this.bounds = bounds;
    if (this.parent) {
      this.parent.metadata.bounds = bounds;
    }
  }
  runAfterSetParent() {
    if (this.bounds) {
      this.parent.metadata.bounds = this.bounds;
    }
  }
  // addToMap(map) {
  //   if (!map.getSource(this.id)) {
  //     map.addSource(this.id, this.getMapboxSource());
  //   }
  // }
  // removeFromMap(map) {
  //   if (map.getSource(this.id)) {
  //     map.removeSource(this.id);
  //   }
  // }
  setHeaders(headers = []) {
    this.headers = headers;
  }
  getMapboxSource() {
    return;
  }
}
