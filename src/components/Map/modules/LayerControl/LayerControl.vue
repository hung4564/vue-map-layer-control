<script setup>
import LayerItem from "./item/layer-item.vue";
import { EVENTBUS_TYPE, eventBus } from "@hungpv97/vue-map-store";
import {
  useMap,
  ModuleContainer,
  MapControlButton
} from "@hungpv97/vue-library-map";
import SvgIcon from "@jamescoyle/vue-icon";
import { DraggableSidebar } from "@hungpv97/vue-library-draggable";
import { ref, defineProps, onMounted, reactive } from "vue";
import DraggableGroupList from "@/components/DraggableList/draggable-group-list";
import { getAllViewForKey, removeLayer } from "@map/store/store-datasource";
import { mdiDelete, mdiDotsVertical, mdiGroup, mdiLayers } from "@mdi/js";
import { getLayerFromView } from "@map/helper";
import LayerItemContextMenu from "./layer-item-context-menu.vue";
const VIEW_KEY_TYPE = "list";
defineProps({
  disabledDrag: Boolean,
  disabled: Boolean
});
const { c_mapId, $map, callMap } = useMap();
const path = {
  icon: mdiLayers,
  menu: mdiDotsVertical,
  group: { create: mdiGroup },
  deleteAll: mdiDelete
};
const show = ref(true);
function toggleShow() {
  show.value = !show.value;
}
const groupShow = ref({});
const groupRef = ref(null);
const layers_select = ref([]);
function addNewGroup() {
  groupRef.value.addNewGroup("");
}
function onRemoveGroupLayer(group) {
  if (!group || !group.children || group.children.length === 0) {
    return;
  }
  group.children.forEach((view) => {
    let layer = getLayerFromView(view);
    if (!layer) return;
    removeLayer(c_mapId.value, layer);
  });
}
const views = ref([]);
function onRemoveAllLayer() {
  if (!views.value || views.value.length === 0) {
    return;
  }
  views.value.forEach((view) => {
    let layer = getLayerFromView(view);
    if (!layer) return;
    removeLayer(c_mapId.value, layer);
  });
}
function getViewFromStore() {
  views.value = getAllViewForKey(c_mapId.value, VIEW_KEY_TYPE).sort(
    (a, b) => b.index - a.index
  );
}
function updateLayers() {
  callMap((map) => {
    let beforeId;
    views.value
      .slice()
      .reverse()
      .forEach(async (view, index) => {
        view.index = index;
        let layer = getLayerFromView(view);
        layer.moveLayer(map, beforeId);
        beforeId = await layer.getBeforeId();
      });
  });
}
const onUpdateLayer = (view) => {
  callMap((map) => {
    let layer = getLayerFromView(view);

    layer.toggleShow(map, view.show);

    if (!view.disabled_opacity) layer.setOpacity(map, view.opacity);
  });

  getViewFromStore();
};
const onToBounds = (bounds) => {
  if (!bounds) {
    return;
  }
  callMap((map) => {
    map.fitBounds(bounds, {
      padding: 50,
      duration: 10
    });
  });
};
const onRemoveLayer = (view) => {
  if (!view) return;
  let layer = getLayerFromView(view);
  if (!layer) return;
  if (menu_context && menu_context.view && menu_context.view.id === view.id) {
    closeContextMenu();
  }
  removeLayer(c_mapId.value, layer);
};
const onLayerAction = ({ menu, item }) => {
  console.log("🚀 ~ onLayerAction ~ menu", menu);
  if (menu && menu.click) {
    callMap((map) => {
      menu.click(item, map, menu);
    });
  }
};
const menu_context = reactive({
  items: [],
  view: null
});
const contextMenuRef = ref(null);
const handleContextClick = (event, item) => {
  menu_context.items = item.menus || [];
  menu_context.view = item;
  contextMenuRef.value.show(event, item);
};
const closeContextMenu = () => {
  menu_context.items = [];
  menu_context.view = null;
  contextMenuRef.value.close();
};
onMounted(() => {
  getViewFromStore();
  eventBus.on(EVENTBUS_TYPE.MAP.SET_LAYER, () => {
    getViewFromStore();
  });
  eventBus.on(EVENTBUS_TYPE.MAP.REMOVE_LAYER, (layer) => {
    if (!layer.canBuildForView(VIEW_KEY_TYPE)) {
      return;
    }
    let view = layer.getView(VIEW_KEY_TYPE);
    if (!view) return;
    let index = views.value.findIndex((x) => x.id === view.id);
    if (index < 0) return;
    views.value.splice(index, 1);
    updateTree();
  });
});
const updateTree = () => {
  if (groupRef.value) groupRef.value.update();
};
</script>
<template>
  <ModuleContainer v-bind="$attrs">
    <template #btn>
      <MapControlButton
        v-if="!show"
        :tooltip="$map.trans('map.home.title')"
        @click="toggleShow()"
        :active="show"
      >
        <SvgIcon size="14" type="mdi" :path="path.icon" />
      </MapControlButton>
    </template>

    <template #draggable="props">
      <DraggableSidebar v-bind="props" :show.sync="show">
        <template #title>
          <span class="layer-control__title">Layer control</span>
        </template>
        <div class="layer-control">
          <div class="layer-control-container">
            <div class="layer-control__header">
              <div class="v-spacer"></div>
              <div class="layer-item__button" @click="addNewGroup()">
                <SvgIcon size="14" type="mdi" :path="path.group.create" />
              </div>
              <div class="layer-item__button" @click="onRemoveAllLayer">
                <SvgIcon size="14" type="mdi" :path="path.deleteAll" />
              </div>
            </div>
            <div class="layer-control__list">
              <draggable-group-list
                ref="groupRef"
                :items.sync="views"
                :groupShow.sync="groupShow"
                :selected.sync="layers_select"
                :disabled="disabled"
                :disabledDrag="disabledDrag"
                @click-drag:done="updateLayers()"
                @click-group:remove="onRemoveGroupLayer"
              >
                <template #item="{ isSelected, item, toggleSelect }">
                  <slot
                    name="item"
                    :item="item"
                    :isSelected="isSelected"
                    :toggleSelect="toggleSelect"
                  >
                    <component
                      :is="item.component || LayerItem"
                      :item="item"
                      :isSelected="isSelected"
                      @click="toggleSelect(item)"
                      @update:item="onUpdateLayer"
                      @click:bounds="onToBounds"
                      @click:remove="onRemoveLayer"
                      @click:action="onLayerAction"
                    >
                      <template #extra-btn="{ loading }">
                        <div
                          v-if="item.menus && item.menus.length > 0"
                          class="layer-item__button"
                          :disabled="loading"
                          @click.prevent.stop="handleContextClick($event, item)"
                        >
                          <SvgIcon size="14" type="mdi" :path="path.menu" />
                        </div>
                      </template>
                    </component>
                  </slot>
                </template>
              </draggable-group-list>
            </div>
          </div>
        </div>
      </DraggableSidebar>
    </template>

    <LayerItemContextMenu
      ref="contextMenuRef"
      :options="menu_context.items"
      @click:option="onLayerAction"
    />
    <slot />
  </ModuleContainer>
</template>

<style>
.fill-height {
  height: 100%;
}
</style>
<style scoped>
.layer-control-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.layer-control__list {
  flex-grow: 1;
  overflow: auto;
  padding: 4px 12px 8px;
}
.layer-control {
  height: 100%;
  overflow: hidden;
}
.layer-control__title {
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.draggable-group__divider {
  padding: 4px 0;
  display: block;
  flex: 1 1 100%;
  height: 0px;
  max-height: 0px;
  opacity: 0.12;
  transition: inherit;
  border-style: solid;
  border-width: thin 0 0 0;
}
.layer-control__header {
  display: flex;
  align-items: center;
  padding: 8px;
}
.v-spacer {
  flex: 1 1 auto;
}
.layer-control__header .layer-item__button {
  display: inline-flex;
  min-width: 20px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
</style>
