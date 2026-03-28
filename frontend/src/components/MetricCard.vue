<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  delta: {
    type: String,
    default: "",
  },
});
</script>

<template>
  <article class="metric-card">
    <p class="metric-label">{{ label }}</p>
    <p class="metric-value">{{ value }}</p>
    <p v-if="delta" class="metric-delta">{{ delta }}</p>
  </article>
</template>
