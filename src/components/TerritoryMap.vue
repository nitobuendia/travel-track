<script setup>
  import { onMounted, onUnmounted, ref, watch } from 'vue';
  import { visitedTerritories } from '../store/visited_territory_data';
  import PinComponent from './PinComponent.vue';

  import { default as map_svg } from '../api/map_svg';
  import { default as map_generic } from '../api/map_generic';
  import { default as map_canvas } from '../api/map_canvas';

  const MAP_TYPE = 'svg';

  const canvasElement = ref();
  const svgElement = ref();
  const mapContainer = ref();
  let dataMap = null;
  let drawMap = null;
  let drawElement = null;

  /** Redraws the map. Used when resizing the window. */
  const redrawMap = () => {
    if (!dataMap || !drawMap || !drawElement) return; // Not loaded yet.
    if (MAP_TYPE === 'svg') drawElement.innerHTML = ''; // Clear the SVG.
    drawMap(drawElement, dataMap);
  };

  onMounted(async () => {
    const canvas = canvasElement.value;
    const svg = svgElement.value;

    dataMap = await map_generic.loadJsonDataMap(map_generic.WORLD_MAP);

    if (MAP_TYPE === 'svg') {
      drawMap = map_svg.drawMapOnSvg;
      drawElement = svg;
      canvas.parentNode.removeChild(canvas);
    } else {
      // if (MAP_TYPE === 'canvas')
      drawMap = map_canvas.drawMapOnCanvas;
      drawElement = canvas;
      svg.parentNode.removeChild(svg);
    }

    drawMap(drawElement, dataMap);
    window.addEventListener('resize', redrawMap);

    watch(visitedTerritories, () => {
      redrawMap();
    });
  });

  onUnmounted(() => {
    window.removeEventListener('resize', redrawMap);
  });
</script>

<template>
  <section id="territory-map" ref="mapContainer">
    <PinComponent />
    <canvas
      ref="canvasElement"
      width="960"
      height="600"></canvas>
    <svg
      ref="svgElement"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"></svg>
  </section>
</template>

<style scoped>
  #territory-map {
    margin: 0 auto -3rem auto;
    max-width: 1200px;
    text-align: center;
    width: 100%;
  }

  #territory-map:has(.sticky) {
    background: var(--color-dark-gray);
    position: sticky;
    top: 0;
    z-index: 5000;
  }

  #territory-map canvas {
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    padding: 0.5rem 0.5rem 2rem 0.5rem;
    width: 100%;
  }

  #territory-map svg {
    height: 100%;
    max-width: 100%;
    max-height: 100%;
    width: 100%;
  }
</style>
