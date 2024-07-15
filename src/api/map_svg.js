
import * as d3_geo from 'd3-geo';
import { default as map_generic } from './map_generic';

const drawFeatures = (svg, path, dataMap, attributes) => {
  const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathElement.setAttribute('d', path(dataMap));
  for (const [attributeName, attributeValue] of Object.entries(attributes)) {
    pathElement.setAttribute(attributeName, attributeValue);
  }
  svg.appendChild(pathElement);
};

const drawMapOnSvg = (svg, dataMap, territoryMap, visitedTerritories) => {
  const outline = { type: 'Sphere' };

  const width = parseInt(svg.getAttribute('width'));
  const projection = d3_geo.geoNaturalEarth1().fitWidth(width, outline);
  const height = map_generic.calculateCanvasHeight(projection, outline);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);

  const path = d3_geo.geoPath().projection(projection);

  drawFeatures(svg, path, outline, {
    'stroke': '#ffffff',
    'fill': 'none',
  });
};

export default {
  drawMapOnSvg,
}
