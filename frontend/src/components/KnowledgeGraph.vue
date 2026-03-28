<script setup>
import { computed } from "vue";

const props = defineProps({
  graph: {
    type: Object,
    required: true,
  },
});

const colorByGroup = {
  "基础": "#ff9b71",
  "核心": "#3f7cff",
  "能力": "#19a88b",
  "跨课": "#7d5cff",
};

const nodeMap = computed(() =>
  Object.fromEntries((props.graph?.nodes || []).map((node) => [node.id, node])),
);

const edges = computed(() =>
  (props.graph?.edges || []).map((edge) => ({
    ...edge,
    sourceNode: nodeMap.value[edge.source],
    targetNode: nodeMap.value[edge.target],
  })),
);

function splitLabel(label) {
  if (!label) {
    return [""];
  }
  if (label.length <= 4) {
    return [label];
  }
  return [label.slice(0, 4), label.slice(4)];
}
</script>

<template>
  <div class="graph-shell">
    <svg viewBox="0 0 720 320" class="graph-svg" aria-label="知识图谱">
      <line
        v-for="edge in edges"
        :key="`${edge.source}-${edge.target}`"
        :x1="edge.sourceNode?.x"
        :y1="edge.sourceNode?.y"
        :x2="edge.targetNode?.x"
        :y2="edge.targetNode?.y"
        class="graph-edge"
      />
      <g
        v-for="node in graph.nodes"
        :key="node.id"
        :transform="`translate(${node.x}, ${node.y})`"
      >
        <circle
          r="36"
          :fill="colorByGroup[node.group] || '#3f7cff'"
          fill-opacity="0.18"
          stroke-width="2"
          :stroke="colorByGroup[node.group] || '#3f7cff'"
        />
        <circle
          r="25"
          :fill="colorByGroup[node.group] || '#3f7cff'"
          fill-opacity="0.9"
        />
        <text
          v-for="(line, lineIndex) in splitLabel(node.label)"
          :key="`${node.id}-${lineIndex}`"
          :y="lineIndex === 0 && splitLabel(node.label).length > 1 ? '-2' : lineIndex * 12 + 4"
          text-anchor="middle"
          class="graph-node-label"
        >
          {{ line }}
        </text>
      </g>
    </svg>
    <div class="graph-legend">
      <span v-for="(color, group) in colorByGroup" :key="group">
        <i :style="{ background: color }" />
        {{ group }}
      </span>
    </div>
  </div>
</template>
