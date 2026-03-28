<script setup>
import { computed } from "vue";

const props = defineProps({
  points: {
    type: Array,
    required: true,
  },
});

const width = 420;
const height = 220;
const padding = 26;
const minValue = 50;
const maxValue = 100;

function getPoint(index, score, total) {
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  return {
    x: padding + (usableWidth / Math.max(total - 1, 1)) * index,
    y: height - padding - ((score - minValue) / (maxValue - minValue)) * usableHeight,
  };
}

const coordinates = computed(() =>
  props.points.map((point, index) => ({
    ...point,
    ...getPoint(index, point.score, props.points.length),
  })),
);

const pathData = computed(() =>
  coordinates.value
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" "),
);
</script>

<template>
  <svg :viewBox="`0 0 ${width} ${height}`" class="trend-svg" aria-label="能力成长曲线">
    <line x1="26" y1="194" x2="394" y2="194" class="trend-axis" />
    <line x1="26" y1="26" x2="26" y2="194" class="trend-axis" />
    <path :d="pathData" class="trend-line" />
    <g v-for="point in coordinates" :key="point.week">
      <circle :cx="point.x" :cy="point.y" r="5" class="trend-dot" />
      <text :x="point.x" y="210" text-anchor="middle" class="trend-label">{{ point.week }}</text>
      <text :x="point.x" :y="point.y - 12" text-anchor="middle" class="trend-value">{{ point.score }}</text>
    </g>
  </svg>
</template>
