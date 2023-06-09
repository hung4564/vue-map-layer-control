<template setup>
  <ModuleContainer v-bind="$attrs">
    <template #btn>
      <MapControlButton
        :tooltip="$map.trans('map.identify.title')"
        @click="toggleShow()"
        v-if="hasViews"
        :active="show"
      >
        <SvgIcon size="14" type="mdi" :path="path.icon" />
      </MapControlButton>
    </template>

    <template #draggable="props">
      <DraggablePopup
        v-if="show"
        :show.sync="show"
        v-bind="props"
        :width="400"
        :height="300"
        @close="close"
        :title="$map.trans('map.identify.title')"
      >
        <template #extra-btn>
          <baseButton
            @click="!isSelectBbox ? onStartBox() : onRemoveBox()"
            :active="isSelectBbox"
          >
            <SvgIcon size="14" type="mdi" :path="path.boxSelect" />
          </baseButton>
        </template>
        <div class="identify-control-container">
          <div class="identify-control-header">
            <b>{{ $map.trans("map.identify.point") }}:</b>
            <span v-html="currentPoint"> </span>
          </div>
          <hr class="identify-control-separator" />
          <div class="identify-control-body">
            <div
              v-for="item in result.items"
              :key="item.view.id"
              class="identify-control-list-item"
            >
              <div class="identify-control-list-item__header">
                {{ item.name }}
              </div>
              <div class="identify-control-list-item__container">
                <div
                  class="identify-control-child-item"
                  v-for="child in item.children"
                  :key="child.id"
                >
                  <span>
                    {{ child.name }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DraggablePopup>
    </template>
  </ModuleContainer>
</template>
<script setup>
import { storeLang } from "@hungpv97/vue-map-store";
import { EVENTBUS_TYPE, eventBus } from "@hungpv97/vue-map-store";
import { DraggablePopup } from "@hungpv97/vue-library-draggable";
import {
  useMap,
  ModuleContainer,
  MapControlButton
} from "@hungpv97/vue-library-map";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiHandPointingUp, mdiSelect } from "@mdi/js";
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { getAllViewForKey } from "@map/store/store-datasource";
import { getLayerFromView } from "@map/helper";
import baseButton from "@/components/base/base-button.vue";
import enLang from "@/lang/en/identify.json";
import { startBoxRangerMap } from "./map-ranger";
const VIEW_KEY_TYPE = "identify";
const path = {
  icon: mdiHandPointingUp,
  boxSelect: mdiSelect
};
const { c_mapId, callMap, $map } = useMap();
storeLang.updateMapLang(c_mapId.value, {
  map: { identify: enLang }
});
const show = ref(false);
const isUseClick = ref(false);
const origin = reactive({ latitude: 0, longitude: 0 });
function toggleShow() {
  show.value = !show.value;
  isUseClick.value = !isUseClick.value;
  if (isUseClick.value) {
    onAddIdenity();
  } else {
    onRemoveIdenity();
  }
}
function onAddIdenity() {
  result.items = [];
  onAddClick();
}
function onRemoveIdenity() {
  onRemoveClick();
  onRemoveBox();
}
function onAddClick() {
  callMap((map) => {
    map.getCanvas().classList.add("pointer");
    map.on("click", onMapClick);
  });
}
function onRemoveClick() {
  callMap((map) => {
    map.getCanvas().classList.remove("pointer");
    map.off("click", onMapClick);
  });
}
function onMapClick(e) {
  origin.latitude = e.lngLat.lat;
  origin.longitude = e.lngLat.lng;
  callMap((map) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: allLayerIds.value
    });
    onSelectFeatures(features);
  });
}
let map_ranger = null;
const isSelectBbox = ref(false);
function onStartBox() {
  isSelectBbox.value = true;
  callMap((map) => {
    map.dragPan.disable();
    map.boxZoom.disable();
    map_ranger = startBoxRangerMap(map.getCanvasContainer(), (bbox) => {
      map.dragPan.enable();
      map.boxZoom.enable();
      onRemoveBox();
      if (!bbox) return;
      onMapBbox(bbox);
    });
  });
}
function onMapBbox(bbox) {
  if (!bbox) return;
  callMap((map) => {
    const features = map.queryRenderedFeatures(bbox, {
      layers: allLayerIds.value
    });
    onSelectFeatures(features);
  });
}
function onRemoveBox() {
  isSelectBbox.value = false;
  if (map_ranger) {
    map_ranger.destroy();
    map_ranger = null;
  }
}
const result = reactive({ items: [], loading: false });
function onSelectFeatures(features) {
  result.items = [];
  let res = features.reduce((acc, cur) => {
    let layer_map = cur.layer;
    let layer_view = idLayersMapping.value[layer_map.id];
    if (!layer_view) {
      return acc;
    }
    let field_id = layer_view.config.field_id || "id";
    let field_name = layer_view.config.field_name || "name";
    if (!acc[layer_view.id]) {
      acc[layer_view.id] = {
        name: layer_view.name,
        view: layer_view,
        children: {},
        field_name,
        menus: layer_view.config.menus
      };
    }
    acc[layer_view.id].children[cur.properties[field_id]] = {
      id: cur.properties[field_id],
      name: cur.properties[field_name],
      data: Object.assign(
        {
          geometry: cur.geometry
        },
        cur.properties
      )
    };
    return acc;
  }, {});
  result.items = Object.keys(res).map((key) => res[key]);
}
const views = ref([]);
function getViewFromStore() {
  views.value = getAllViewForKey(c_mapId.value, VIEW_KEY_TYPE).sort(
    (a, b) => b.index - a.index
  );
}
const hasViews = computed(() => {
  return views.value.length > 0;
});
const idLayersMapping = computed(() => {
  return views.value.reduce((acc, view) => {
    let layer = getLayerFromView(view);
    let view_layer = layer.getView("map");
    let layer_ids = view_layer.getAllLayerIds();
    layer_ids.forEach((layer_id) => {
      acc[layer_id] = view;
    });
    return acc;
  }, {});
});
const allLayerIds = computed(() => Object.keys(idLayersMapping.value));
onMounted(() => {
  getViewFromStore();
  eventBus.on(EVENTBUS_TYPE.MAP.SET_LAYER, () => {
    getViewFromStore();
  });
  eventBus.on(EVENTBUS_TYPE.MAP.REMOVE_LAYER, () => {
    getViewFromStore();
  });
});
onBeforeUnmount(() => {
  onRemoveIdenity();
});
const currentPoint = computed(() => {
  return origin.longitude + ",&nbsp;" + origin.latitude;
});
function close() {
  onRemoveIdenity();
}
</script>
<style>
.boxdraw {
  border: dashed 2px black;
  background-color: #ffffff30;
}
</style>
<style scoped lang="scss">
.identify-control__button {
  display: inline-flex;
  min-width: 20px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.identify-control {
  &-container {
    display: flex;
    flex-direction: column;
    b {
      color: var(--v-primary-base, #38d4ff);
      padding-right: 4px;
      font-weight: bolder;
    }
  }
  &-header {
    padding: 8px;
    width: 100%;
    flex-grow: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }
  &-separator {
    flex-grow: 0;
    display: block;
    flex: 1 1 0px;
    max-width: 100%;
    height: 0;
    max-height: 0;
    border: solid;
    border-width: thin 0 0 0;
  }
  &-body {
    flex-grow: 1;
    overflow: auto;
    padding: 16px;
  }
  &-list-item {
    // box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2),
    //   0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12);
    display: block;
    max-width: 100%;
    position: relative;
    padding: 4px;
    border: solid;
    border-width: thin;
    margin-bottom: 4px;
    &__header {
      color: var(--v-primary-base, #38d4ff);
      font-weight: bolder;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      font-size: 1rem !important;
      line-height: 1.75rem;
      letter-spacing: 0.009375em !important;
    }
    &__container {
      align-items: center;
      display: flex;
      letter-spacing: normal;
      min-height: 30px;
      outline: none;
      padding: 0 12px;
      position: relative;
      margin-top: 4px;
    }
  }
}
</style>
