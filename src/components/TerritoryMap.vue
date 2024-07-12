<script setup>
import { onMounted, ref, watch } from 'vue'
import { territories, visitedTerritories } from '../models/territory_data'

import * as d3_geo from 'd3-geo'
import * as d3_fetch from 'd3-fetch'
import * as topojson from 'topojson-client'

const d3 = Object.freeze({
  ...d3_geo,
  ...d3_fetch
})

const territoryMap = {}
for (const territory of territories) {
  territoryMap[territory.id] = territory.code
}

const canvasElement = ref()

const calculateCanvasHeight = (projection, mesh) => {
  const [[x0, y0], [x1, y1]] = d3.geoPath(projection).bounds(mesh)
  const dy = Math.ceil(y1 - y0)
  const l = Math.min(Math.ceil(x1 - x0), dy)
  projection.scale((projection.scale() * (l - 1)) / l).precision(0.2)
  return dy
}

const drawFeatures = (context, path, dataMap, dataFeature, attributes) => {
  context.beginPath()

  if (dataFeature) {
    path(topojson.feature(dataMap, dataFeature))
  } else {
    path(dataMap)
  }

  let isFill = false
  let isStroke = false
  for (const [attributeName, attributeValue] of Object.entries(attributes)) {
    context[attributeName] = attributeValue
    if (attributeName === 'fillStyle') isFill = true
    if (attributeName === 'strokeStyle') isStroke = true
  }
  if (isFill) context.fill()
  if (isStroke) context.stroke()
  context.restore()
}

const drawMapOnCanvas = (canvas, dataMap) => {
  // const mesh = topojson.mesh(dataMap);
  const outline = { type: 'Sphere' }

  const context = canvas.getContext('2d')
  context.save()

  const width = parseInt(canvas.getAttribute('width'))
  const projection = d3.geoNaturalEarth1().fitWidth(width, outline)
  const height = calculateCanvasHeight(projection, outline)
  canvas.setAttribute('width', width)
  canvas.setAttribute('height', height)

  const path = d3.geoPath().projection(projection).context(context)

  drawFeatures(context, path, outline, null, {
    strokeStyle: '#ffffff',
    lineWidth: '2'
  })

  const visitedDataMap = { ...dataMap.objects.countries }
  visitedDataMap.geometries = visitedDataMap.geometries.filter((geometry) => {
    const territoryId = geometry.id
    const territoryCode = territoryMap[territoryId]
    return visitedTerritories[territoryCode]
  })
  drawFeatures(context, path, dataMap, visitedDataMap, {
    fillStyle: '#5ebe74'
  })

  drawFeatures(context, path, dataMap, visitedDataMap, {
    strokeStyle: '#ffffff',
    lineWidth: '0.7'
  })

  const nonVisitedDataMap = { ...dataMap.objects.countries }
  nonVisitedDataMap.geometries = nonVisitedDataMap.geometries.filter((geometry) => {
    const territoryId = geometry.id
    const territoryCode = territoryMap[territoryId]
    return !visitedTerritories[territoryCode]
  })
  drawFeatures(context, path, dataMap, nonVisitedDataMap, {
    fillStyle: '#000000'
  })

  drawFeatures(context, path, dataMap, nonVisitedDataMap, {
    strokeStyle: '#ffffff',
    lineWidth: '0.7'
  })
}

let dataMap
const loadDataMap = async () => {
  if (dataMap) return
  dataMap = await d3.json(
    // TODO: import data instead of relying on CDN.
    'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
  )
  // 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json');
}

onMounted(async () => {
  const canvas = canvasElement.value
  await loadDataMap()

  drawMapOnCanvas(canvas, dataMap)
  watch(visitedTerritories, () => {
    drawMapOnCanvas(canvas, dataMap)
  })
})
</script>

<template>
  <section id="territory-map">
    <canvas ref="canvasElement" width="960" height="600"></canvas>
  </section>
</template>

<style scoped>
#territory-map {
  margin: 0 auto -3rem auto;
  text-align: center;
}

#territory-map.sticky {
  background: var(--color-dark-gray);
  position: sticky;
  top: 0;
}

#territory-map canvas {
  padding: 0.5rem 0.5rem 2rem 0.5rem;
}
</style>
