
import * as d3_geo from 'd3-geo';
import { default as map_generic } from './map_generic';

const drawMapOnSvg = (svg, dataMap, territoryMap, visitedTerritories) => {
  const outline = { type: 'Sphere' };

  const width = parseInt(svg.getAttribute('width'));
  const projection = d3_geo.geoNaturalEarth1().fitWidth(width, outline);
  const height = map_generic.calculateCanvasHeight(projection, outline);
  // svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);

  const path = d3_geo.geoPath().projection(projection);

  const outlinePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  outlinePath.setAttribute('d', path(outline));
  outlinePath.setAttribute('stroke', '#ffffff');
  outlinePath.setAttribute('fill', 'none');
  svg.appendChild(outlinePath);
};

export default {
  drawMapOnSvg,
}
