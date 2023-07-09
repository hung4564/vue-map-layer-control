import { ABuild } from "./_default";

export class LayerIdentifyBuild extends ABuild {
  constructor(option = {}) {
    super("identify", option, {});
    this.setFieldName().setFieldId();
    this.setBuild(createDefaultViewInList);
  }
  setFieldName(field_name = "name") {
    this.option.field_name = field_name;
    return this;
  }
  setFieldId(field_id = "id") {
    this.option.field_id = field_id;
    return this;
  }
}
export function createDefaultViewInList(layer, option = {}) {
  let parent = null;
  let temp = {
    setParent(_parent) {
      parent = _parent;
    },
    get parent() {
      return parent;
    },
    get id() {
      return layer.id;
    },
    get name() {
      return layer.name;
    },
    config: {
      field_name: "name",
      field_id: "id"
    }
  };
  if (option.field_name) {
    temp.config.field_name = option.field_name;
  }

  if (option.field_id) {
    temp.config.field_id = option.field_id;
  }

  return temp;
}
