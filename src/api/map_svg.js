
import * as d3_geo from 'd3-geo';
import * as topojson from 'topojson-client';
import { default as map_generic } from './map_generic';

const drawFeatures = (svg, path, dataMap, dataFeature, attributes) => {
  const gPath = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  const dPath = dataFeature ?
    path(topojson.feature(dataMap, dataFeature)) :
    path(dataMap);

  const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathElement.setAttribute('d', dPath);
  for (const [attributeName, attributeValue] of Object.entries(attributes)) {
    if (['click', 'hover'].includes(attributeName)) {
      pathElement.addEventListener(attributeName, attributeValue);
      continue;
    }
    if (attributeName === 'title') {
      pathElement.setAttribute('alt', attributeValue);
      const pathTitle = document.createElement('title');
      pathTitle.innerText = attributeValue;
      gPath.appendChild(pathTitle);
    }
    pathElement.setAttribute(attributeName, attributeValue);
  }


  gPath.appendChild(pathElement);
  svg.appendChild(gPath);
};

const drawTerritories = (svg, path, dataMap, dataFeature, territoryMap, attributes) => {
  const geometryType = dataFeature.type;
  for (const geometry of dataFeature.geometries) {
    const territoryGeometry = {
      'type': geometryType,
      'geometries': [geometry],
    };

    const territoryId = geometry.id;
    const territoryCode = territoryMap[territoryId];
    const territoryAttributes = {
      ...attributes,
      'title': territoryCode,
    };

    drawFeatures(svg, path, dataMap, territoryGeometry, territoryAttributes);
  }
};

const drawMapOnSvg = (svg, dataMap, territoryMap, visitedTerritories) => {
  const clickTerritoryHandler = (event) => {
    const clickedTerritory = event.target;
    const territoryCode = clickedTerritory.getAttribute('title');

    const visitedState = visitedTerritories[territoryCode];
    visitedTerritories[territoryCode] = !visitedState;
  };

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

  drawTerritories(svg, path, dataMap, visitedDataMap, territoryMap, {
    'click': clickTerritoryHandler,
    'fill': '#5ebe74',
    'stroke': '#ffffff',
    'stroke-width': '0.7',
  });

  const nonVisitedDataMap = { ...dataMap.objects.countries };
  nonVisitedDataMap.geometries = nonVisitedDataMap.geometries.filter(
    (geometry) => {
      const territoryId = geometry.id;
      const territoryCode = territoryMap[territoryId];
      return !visitedTerritories[territoryCode];
    }
  );

  drawTerritories(svg, path, dataMap, nonVisitedDataMap, territoryMap, {
    'click': clickTerritoryHandler,
    'fill': '#000000',
    'stroke': '#ffffff',
    'stroke-width': '0.7',
  });
};

export default {
  drawMapOnSvg,
}
