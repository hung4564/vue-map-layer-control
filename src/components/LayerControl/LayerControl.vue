<template>
  <ModuleContainer v-bind="bindModule">
    <template #btn>
      <MapControlButton
        v-if="!show"
        :tooltip="$map.trans('map.home.title')"
        @click="toggleShow()"
        :active="show"
      >
        <SvgIcon :size="18" type="mdi" :path="path.icon" />
      </MapControlButton>
    </template>
    <template #draggable="props">
      <DraggableSidebar v-bind="props" :show.sync="show" v-if="show">
        <template #title>
          <span class="layer-control__title">Layer control</span>
        </template>
        <div class="layer-control">
          <div class="layer-control-container">
            <div class="layer-control__header">
              <div class="v-spacer"></div>
              <div class="layer-item__button" @click="addNewGroup">
                <SvgIcon :size="18" type="mdi" :path="path.group.create" />
              </div>
              <div class="layer-item__button" @click="onRemoveAllLayer">
                <SvgIcon :size="18" type="mdi" :path="path.deleteAll" />
              </div>
            </div>
            <div class="layer-control__list">
              <draggable-group-list
                ref="layerGroup"
                class="overflow-auto pa-4"
                :items.sync="layers"
                :groupShow.sync="groupShow"
                :selected.sync="itemsLayerSelectId"
                :disabled="disabled"
                :disabledDrag="disabledDrag"
                @click-drag:done="updateLayers()"
                @click-group:remove="$emit('click:remove-group', $event)"
                @click-group:toggle-show="onToggleShowGroup"
              >
                <template #item="{ isSelected, item, toggleSelect }">
                  <slot
                    name="item"
                    :item="item"
                    :isSelected="isSelected"
                    :toggleSelect="toggleSelect"
                  >
                    <LayerItem
                      :item="item"
                      :isSelected="isSelected"
                      @update:item="onUpdateLayer"
                      @click:bounds="onToBounds"
                      @click:remove="onRemoveLayer"
                      @click:action="onLayerAction"
                      @click="toggleSelect(item)"
                    >
                      <template #extra-btn="{ loading }">
                        <div
                          v-if="item.menus && item.menus.length > 0"
                          class="layer-item__button"
                          :disabled="loading"
                          @click.prevent.stop="handleContextClick($event, item)"
                        >
                          <SvgIcon :size="16" type="mdi" :path="path.menu" />
                        </div>
                      </template>
                    </LayerItem>
                  </slot>
                </template>
              </draggable-group-list>
            </div>
          </div>
        </div>
      </DraggableSidebar>
    </template>
    <slot />
    <LayerItemContextMenu
      ref="vueSimpleContextMenu"
      :options="menu_context.items"
      @click:option="onLayerAction"
    />
  </ModuleContainer>
</template>

<script>
import LayerItemContextMenu from "./layer-item-context-menu.vue";
import LayerItem from "./layer-item.vue";
import DraggableGroupList from "@/components/DraggableList/draggable-group-list";
import { DraggableSidebar } from "@hungpv4564/vue-library-draggable";
import { mdiDelete, mdiDotsVertical, mdiGroup, mdiLayers } from "@mdi/js";
import {
  ModuleMixin,
  MapControlButton
} from "@hungpv4564/vue-library-map/mixin";
import {
  createLayer,
  getLayerData,
  removeLayer,
  updateLayerSimple,
  toggleShow
} from "@/model";
export default {
  components: {
    MapControlButton,
    DraggableSidebar,
    DraggableGroupList,
    LayerItem,
    LayerItemContextMenu
  },
  mixins: [ModuleMixin],
  props: { disabledDrag: Boolean, disabled: Boolean },
  data: () => ({
    menu_context: {
      items: [],
      layer: null
    },
    show: true,
    layers: [],
    itemsLayerSelectId: [],
    groupShow: {}
  }),
  computed: {
    path() {
      return {
        icon: mdiLayers,
        menu: mdiDotsVertical,
        group: { create: mdiGroup },
        deleteAll: mdiDelete
      };
    }
  },
  watch: {},
  methods: {
    handleContextClick(event, item) {
      this.menu_context.items = item.menus || [];
      this.menu_context.layer = item;
      this.$refs.vueSimpleContextMenu.show(event, item);
    },
    closeContextMenu() {
      this.$refs.vueSimpleContextMenu.close();
      this.menu_context.items = [];
      this.menu_context.layer = null;
    },
    toggleShow() {
      this.show = !this.show;
    },
    updateLayers() {
      let beforeId;
      this.layers.forEach((layer) => {
        let temp = getLayerData(layer);
        temp.moveLayer(this.map, beforeId);
        beforeId = temp.getBeforeId();
      });
    },
    addLayer(info) {
      this.layers.unshift(createLayer(this.map, info));
      if (this.$refs.layerGroup) this.$refs.layerGroup.update();
    },
    onUpdateLayer(layer) {
      updateLayerSimple(this.map, layer);
    },
    onToBounds(layer) {
      let temp = getLayerData(layer);
      if (!temp) return;
      let bounds =
        layer.metadata && layer.metadata.bounds ? layer.metadata.bounds : null;
      temp.flyTo(this.map, bounds);
    },
    onRemoveLayer(layer) {
      this.removeLayer(layer);
      let index = this.layers.findIndex((x) => x.id == layer.id);
      if (index < 0) {
        return;
      }
      this.layers.splice(index, 1);
    },
    removeLayer(layer) {
      if (
        this.menu_context &&
        this.menu_context.layer &&
        this.menu_context.layer.id === layer.id
      ) {
        this.closeContextMenu();
      }
      removeLayer(this.map, layer);
    },
    onDestroy() {
      this.onRemoveAllLayer();
    },
    onRemoveAllLayer() {
      this.layers.forEach((layer) => {
        if (!layer.disable_delete) removeLayer(this.map, layer);
      });
      this.layers = [];
    },
    onLayerAction({ menu, item }) {
      if (menu && menu.click) menu.click(item, this.map, menu);
    },
    addNewGroup() {
      this.$refs.layerGroup.addNewGroup("");
    },
    onToggleShowGroup(group) {
      let show = group.show;
      let children = group.children || [];
      children.forEach((child) => {
        child.show = show;
        toggleShow(this.map, child, show);
      });
    }
  }
};
</script>
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
  padding: 2px 8px 8px;
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
  display: inline-block;
  margin-left: 8px;
  cursor: pointer;
}
</style>
