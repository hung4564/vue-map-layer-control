<script setup>
import { mdiLayers } from "@mdi/js";
import {
  useMap,
  ModuleContainer,
  MapControlButton
} from "@hungpv97/vue-library-map";
import SvgIcon from "@jamescoyle/vue-icon";
import { DraggableSidebar } from "@hungpv97/vue-library-draggable";
import { ref } from "vue";
const { $map } = useMap();
const show = ref(false);
function toggleShow() {
  show.value = !show.value;
}
const path = { icon: mdiLayers };
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
      <DraggableSidebar v-bind="props" :show.sync="show"></DraggableSidebar>
    </template>
    <slot />
  </ModuleContainer>
</template>
