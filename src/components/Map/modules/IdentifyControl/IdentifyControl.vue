<template setup>
  <ModuleContainer v-bind="$attrs">
    <template #btn>
      <MapControlButton
        tooltip="IdentifyControl"
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
        title="IdentifyControl"
      ></DraggablePopup>
    </template>
  </ModuleContainer>
</template>
<script setup>
import { EVENTBUS_TYPE, eventBus } from "@hungpv97/vue-map-store";
import { DraggablePopup } from "@hungpv97/vue-library-draggable";
import {
  useMap,
  ModuleContainer,
  MapControlButton
} from "@hungpv97/vue-library-map";
import SvgIcon from "@jamescoyle/vue-icon";
import { mdiHandPointingUp } from "@mdi/js";
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { getAllViewForKey } from "../../store/store-datasource";
import { startBoxRangerMap } from "./map-ranger";
const VIEW_KEY_TYPE = "identify";
const path = {
  icon: mdiHandPointingUp
};
const { c_mapId, callMap } = useMap();
const show = ref(false);
const isUseClick = ref(false);
const result = reactive({ loading: false, items: [] });
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
  onStartRanger();
}
let map_select_ranger = null;
function onStartRanger() {
  callMap((map) => {
    map_select_ranger = startBoxRangerMap(map, (bbox) => {
      console.log("🚀 ~ map_select_ranger=startBoxRangerMap ~ bbox", bbox);
      if (!bbox) return;
    });
    console.log(
      "🚀 ~ map_select_ranger=startBoxRangerMap ~ map_select_ranger",
      map_select_ranger
    );
  });
}
function onRemoveIdenity() {
  onRemoveClick();
  if (map_select_ranger) {
    map_select_ranger.destroy();
    map_select_ranger = null;
  }
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
  console.log("🚀 ~ onMapClick ~ e", e);
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
</script>
<style>
.boxdraw {
  border: dashed 2px black;
  background-color: #ffffff30;
}
</style>
