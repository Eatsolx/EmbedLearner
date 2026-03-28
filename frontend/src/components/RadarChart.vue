<script setup>
import { computed } from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
});

const size = 260;
const center = size / 2;
const radius = 90;

function pointAt(index, total, value = 100) {
  const angle = (-Math.PI / 2) + (index / total) * Math.PI * 2;
  const distance = (value / 100) * radius;
  return {
    x: center + Math.cos(angle) * distance,
    y: center + Math.sin(angle) * distance,
  };
}

const polygonPoints = computed(() =>
  props.items
    .map((item, index) => {
      const point = pointAt(index, props.items.length, item.value);
      return `${point.x},${point.y}`;
    })
    .join(" "),
);

const axes = computed(() =>
  props.items.map((item, index) => ({
    label: item.label,
    value: item.value,
    line: pointAt(index, props.items.length, 100),
    valuePoint: pointAt(index, props.items.length, item.value),
    labelPoint: pointAt(index, props.items.length, 115),
  })),
);
</script>

<template>
  <svg :viewBox="`0 0 ${size} ${size}`" class="radar-svg" aria-label="学情雷达图">
    <circle
      v-for="ring in [25, 50, 75, 100]"
      :key="ring"
      :cx="center"
      :cy="center"
      :r="(ring / 100) * radius"
      class="radar-ring"
    />
    <line
      v-for="axis in axes"
      :key="axis.label"
      :x1="center"
      :y1="center"
      :x2="axis.line.x"
      :y2="axis.line.y"
      class="radar-axis"
    />
    <polygon :points="polygonPoints" class="radar-area" />
    <g v-for="axis in axes" :key="`${axis.label}-point`">
      <circle :cx="axis.valuePoint.x" :cy="axis.valuePoint.y" r="4.5" class="radar-dot" />
      <text :x="axis.labelPoint.x" :y="axis.labelPoint.y" text-anchor="middle" class="radar-label">
        {{ axis.label }}
      </text>
    </g>
  </svg>
</template>
