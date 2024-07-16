
import * as d3_geo from 'd3-geo';
import * as topojson from 'topojson-client';
import { territoriesById } from '../store/territory_data';
import { visitedTerritories } from '../store/visited_territory_data';
import { default as map_generic } from './map_generic';

const _SVG_NS_URI = 'http://www.w3.org/2000/svg';

const drawFeatures = (svg, path, dataMap, dataFeature, attributes) => {
  const dPath = dataFeature ?
    path(topojson.feature(dataMap, dataFeature)) :
    path(dataMap);

  const pathElement = document.createElementNS(_SVG_NS_URI, 'path');
  pathElement.setAttribute('d', dPath);
  for (const [attributeName, attributeValue] of Object.entries(attributes)) {
    if (['click', 'hover'].includes(attributeName)) {
      pathElement.addEventListener(attributeName, attributeValue);
      continue;
    }
    if (attributeName === 'title') {
      pathElement.setAttribute('alt', attributeValue);
      const pathTitle = document.createElementNS(_SVG_NS_URI, 'title');
      pathTitle.textContent = attributeValue;
      pathElement.appendChild(pathTitle);
    }
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

    const territoryAttributes = { ...attributes };

    if (geometry.id) {
      territoryAttributes['id'] = geometry.id;
    }

    const territory = territoriesById[geometry.id];
    if (territory) {
      territoryAttributes['title'] = territory.name;
    } else {
      territoryAttributes['title'] = geometry.properties.name;
    }

    drawFeatures(svg, path, dataMap, territoryGeometry, territoryAttributes);
  }
};

const drawMapOnSvg = (svg, dataMap) => {
  const clickTerritoryHandler = (event) => {
    const clickedTerritory = event.target;
    const territoryId = clickedTerritory.getAttribute('id');
    if (!territoryId) {
      console.warn('Clicked territory is not in the database.');
      return;
    }
    const territory = territoriesById[territoryId];
    if (!territory) {
      console.warn(`Territory id ${territoryId} is not in the database.`);
      return;
    }
    const territoryCode = territory.code;
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
    const territory = territoriesById[geometry.id];
    if (!territory) {
      console.warn(
        `Territory id ${geometry.id} not found in the territory list.`);
      return false;
    }
    return !!visitedTerritories[territory.code];
  });

  drawTerritories(svg, path, dataMap, visitedDataMap, {
    'click': clickTerritoryHandler,
    'fill': '#5ebe74',
    'stroke': '#ffffff',
    'stroke-width': '0.7',
  });

  const nonVisitedDataMap = { ...dataMap.objects.countries };
  nonVisitedDataMap.geometries = nonVisitedDataMap.geometries.filter(
    (geometry) => {
      const territory = territoriesById[geometry.id];
      if (!territory) {
        console.warn(
          `Territory id ${geometry.id} not found in the territory list.`);
        return true;
      }
      return !visitedTerritories[territory.code];
    }
  );

  drawTerritories(svg, path, dataMap, nonVisitedDataMap, {
    'click': clickTerritoryHandler,
    'fill': '#000000',
    'stroke': '#ffffff',
    'stroke-width': '0.7',
  });
};

export default {
  drawMapOnSvg,
}
