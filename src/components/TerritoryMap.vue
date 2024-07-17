<script setup>
import { onMounted, ref, watch } from 'vue';
import { visitedTerritories } from '../store/visited_territory_data';
import PinComponent from './PinComponent.vue';

import {default as map_svg} from '../api/map_svg';
import {default as map_generic} from '../api/map_generic';
import {default as map_canvas} from '../api/map_canvas';

const canvasElement = ref();
const svgElement = ref();

onMounted(async () => {
  const mapType = 'svg';

  const canvas = canvasElement.value;
  const svg = svgElement.value;

  const dataMap = await map_generic.loadJsonDataMap(map_generic.WORLD_MAP);

  let drawMap;
  let drawElement;
  if (mapType === 'svg') {
    drawMap = map_svg.drawMapOnSvg
    drawElement = svg;
    canvas.parentNode.removeChild(canvas);
  } else { // if (mapType === 'canvas')
    drawMap = map_canvas.drawMapOnCanvas;
    drawElement = canvas;
    svg.parentNode.removeChild(svg);
  }

  drawMap(drawElement, dataMap);
  watch(visitedTerritories, () => {
    drawMap(drawElement, dataMap);
  });
});
</script>

<template>
  <section id="territory-map">
    <PinComponent />
    <canvas
      ref="canvasElement"
      width="960"
      height="600"
    ></canvas>
    <svg
      ref="svgElement"
      width="960"
      height="600"
    ></svg>
  </section>
</template>

<style scoped>
#territory-map {
  margin: 0 auto -3rem auto;
  text-align: center;
}

#territory-map:has(.sticky) {
  background: var(--color-dark-gray);
  position: sticky;
  top: 0;
}

#territory-map canvas {
  padding: 0.5rem 0.5rem 2rem 0.5rem;
}
</style>
