
import * as d3_geo from 'd3-geo';
import * as topojson from 'topojson-client';
import { default as map_generic } from './map_generic';

const drawFeatures = (svg, path, dataMap, dataFeature, attributes) => {
  const dPath = dataFeature ?
    path(topojson.feature(dataMap, dataFeature)) :
    path(dataMap);

  const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathElement.setAttribute('d', dPath);
  for (const [attributeName, attributeValue] of Object.entries(attributes)) {
    pathElement.setAttribute(attributeName, attributeValue);
  }
  svg.appendChild(pathElement);
};

const drawTerritories = (svg, path, dataMap, dataFeature, attributes) => {
  const geometryType = dataFeature.type;
  for (const geometry of dataFeature.geometries) {
    const territoryGeometry = {
      'type': geometryType,
      'geometries': [geometry],
    };
    drawFeatures(svg, path, dataMap, territoryGeometry, attributes);
  }
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

  drawFeatures(svg, path, outline, null, {
    'stroke': '#ffffff',
    'fill': 'none',
  });

  const visitedDataMap = { ...dataMap.objects.countries };
  visitedDataMap.geometries = visitedDataMap.geometries.filter((geometry) => {
    const territoryId = geometry.id;
    const territoryCode = territoryMap[territoryId];
    return visitedTerritories[territoryCode];
  });

  drawTerritories(svg, path, dataMap, visitedDataMap, {
    'stroke': '#ffffff',
    'fill': '#5ebe74',
    'stroke-width': '0.7',
  });
};

export default {
  drawMapOnSvg,
}
