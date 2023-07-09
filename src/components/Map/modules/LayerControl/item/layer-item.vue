<template>
  <div class="layer-item-container">
    <div class="layer-item__info">
      <LayerItemIcon
        class="layer-item__icon"
        :loading="loading"
        :item="{ item }"
      />
      <span
        class="layer-item__title"
        :title="item.name"
        @click="emit('click', item)"
      >
        <span>{{ item.name }}</span>
      </span>
      <div class="v-spacer"></div>
      <div class="layer-item__title-action">
        <div
          @click="onAction(menu)"
          v-for="(menu, i) in item.extra_buttons"
          :key="i"
          class="layer-item__button"
          :disabled="loading"
          v-bind="menu.attr"
        >
          <SvgIcon size="14" type="mdi" :path="menu.icon" />
        </div>
        <div
          class="layer-item__button"
          v-if="item.metadata.bounds"
          @click.stop="onToBounds"
          :disabled="loading"
        >
          <SvgIcon size="14" type="mdi" :path="path.flyTo" />
        </div>
        <div
          class="layer-item__button"
          @click.stop="toggleShow"
          :disabled="loading"
        >
          <SvgIcon size="14" type="mdi" :path="path.show" v-if="isShow" />
          <SvgIcon size="14" type="mdi" :path="path.hide" v-else />
        </div>
        <div
          class="layer-item__button"
          v-if="!item.config.disable_delete"
          :disabled="loading"
          @click.stop="onRemove"
        >
          <SvgIcon size="14" type="mdi" :path="path.delete" />
        </div>
        <slot name="extra-btn" :loading="loading" />
      </div>
    </div>
    <div class="layer-item__action" v-if="!item.config.disabled_opacity">
      <div class="layer-item__opacity">
        <LayerItemSlider
          v-model.number="opacity"
          max="1"
          step="0.01"
          :disabled="loading"
        />
      </div>
      <div class="v-spacer"></div>
    </div>
  </div>
</template>
<script setup>
import { computed, defineProps, defineEmits } from "vue";
import SvgIcon from "@jamescoyle/vue-icon";
import LayerItemSlider from "./layer-item-slider.vue";
import LayerItemIcon from "./layer-item-icon.vue";
import {
  mdiCrosshairsGps,
  mdiDelete,
  mdiEye,
  mdiEyeOff,
  mdiLayers,
  mdiLoading
} from "@mdi/js";
const props = defineProps({
  item: {
    require: true,
    type: Object,
    default: () => ({
      name: "",
      metadata: { loading: false, bounds: null },
      opacity: 1,
      show: true,
      menus: [],
      extra_buttons: [],
      disabled_opacity: false,
      disable_delete: false
    })
  }
});
const emit = defineEmits([
  "update:item",
  "click",
  "click:remove",
  "click:action",
  "click:bounds"
]);
const path = {
  loading: mdiLoading,
  layer: mdiLayers,
  flyTo: mdiCrosshairsGps,
  show: mdiEye,
  hide: mdiEyeOff,
  delete: mdiDelete
};
const loading = computed(() => {
  return props.item.metadata && props.item.metadata.loading;
});
const isShow = computed(() => {
  return props.item.show;
});
const opacity = computed({
  get() {
    return props.item.opacity;
  },
  set(value) {
    let item = props.item;
    item.opacity = value;
    emit("update:item", item);
  }
});
const toggleShow = () => {
  let item = props.item;
  item.show = !item.show;
  emit("update:item", item);
};
const onRemove = () => {
  emit("click:remove", props.item);
};

const onAction = (menu) => {
  emit("click:action", { menu, item: props.item });
};
const onToBounds = () => {
  emit("click:bounds", props.item.metadata.bounds);
};
</script>

<style scoped>
.spin {
  animation: 2s linear 0s infinite normal none running spin;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
.layer-item-container {
  overflow: hidden;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.layer-item__info {
  width: 100%;
}
.layer-item__info,
.layer-item__action {
  display: flex;
  align-items: center;
}
.layer-item__action {
  padding-top: 4px;
}
.layer-item__opacity {
  flex: 1 1 auto;
  max-width: 75%;
}
.layer-item__icon {
  flex-grow: 0;
  flex-shrink: 0;
  width: 25px;
}
.layer-item__icon > div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.layer-item__title {
  display: inline-block;
  text-align: left;
  flex-grow: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.75rem !important;
  font-weight: 400;
  line-height: 1.25rem;
  letter-spacing: 0.0333333333em !important;
}
.layer-item__button {
  display: inline-block;
  padding: 0 4px;
  cursor: pointer;
}
.layer-item__title-action {
  display: flex;
  flex-grow: 0;
  align-items: center;
}
.layer-item__title-action .layer-item__button {
  display: flex;
  align-items: center;
  justify-content: center;
}
.layer-item__button[disabled="disabled"] {
  cursor: default;
  pointer-events: none;
  opacity: 0.25;
}
.v-spacer {
  flex: 1 1 auto;
}
</style>
