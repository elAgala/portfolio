<script setup lang="ts">
import type { EvidenceGraphDefinition } from '~/types/experience'

const props = defineProps<{
  definition: EvidenceGraphDefinition
}>()

const nodeById = computed(() => new Map(props.definition.nodes.map(node => [node.id, node])))

function point(position: [number, number, number]) {
  return {
    x: 50 + position[0] * 17,
    y: 72 - position[1] * 30 + position[2] * 5,
  }
}
</script>

<template>
  <div class="architecture-diagram" aria-hidden="true">
    <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
      <line
        v-for="edge in definition.edges"
        :key="edge.id"
        :x1="point(nodeById.get(edge.source)!.position).x"
        :y1="point(nodeById.get(edge.source)!.position).y"
        :x2="point(nodeById.get(edge.target)!.position).x"
        :y2="point(nodeById.get(edge.target)!.position).y"
      />
      <g
        v-for="node in definition.nodes"
        :key="node.id"
        :transform="`translate(${point(node.position).x} ${point(node.position).y})`"
      >
        <circle :class="`architecture-diagram__node--${node.kind}`" r="1.8" />
        <text x="3" y=".7">{{ node.label }}</text>
      </g>
    </svg>
  </div>
</template>
