<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  class: String
})

const cardClasses = computed(() => {
  return `rounded-lg border bg-card text-card-foreground shadow-sm ${props.class || ''}`
})
</script>
