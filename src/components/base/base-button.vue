<template>
  <div
    class="map-control__button"
    v-bind="$attrs"
    v-on="$listeners"
    :class="{ 'map-control__button-active': props.active }"
  >
    <slot />
  </div>
</template>
<script setup>
import { defineProps } from "vue";
const props = defineProps({ active: Boolean });
</script>
<style scoped>
.map-control__button {
  display: inline-flex;
  min-width: 20px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.map-control__button-active {
  color: var(--v-primary-base, #38d4ff);
}
</style>
