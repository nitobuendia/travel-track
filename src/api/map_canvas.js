import * as d3_geo from 'd3-geo';
import * as topojson from 'topojson-client';
import { territoriesById } from '../store/territory_data';
import { visitedTerritories } from '../store/visited_territory_data';
import { default as map_generic } from './map_generic';

const drawFeatures = (context, path, dataMap, dataFeature, attributes) => {
  context.beginPath();

  if (dataFeature) {
    path(topojson.feature(dataMap, dataFeature));
  } else {
    path(dataMap);
  }

  let isFill = false;
  let isStroke = false;
  for (const [attributeName, attributeValue] of Object.entries(attributes)) {
    context[attributeName] = attributeValue;
    if (attributeName === 'fillStyle') isFill = true;
    if (attributeName === 'strokeStyle') isStroke = true;
  }
  if (isFill) context.fill();
  if (isStroke) context.stroke();
  context.restore();
};

const drawMapOnCanvas = (canvas, dataMap) => {
  const outline = { type: 'Sphere' };

  const context = canvas.getContext('2d');
  context.save();

  const width = parseInt(canvas.getAttribute('width'));
  const projection = d3_geo.geoNaturalEarth1().fitWidth(width, outline);
  const height = map_generic.calculateCanvasHeight(projection, outline);
  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);

  const path = d3_geo.geoPath().projection(projection).context(context);

  drawFeatures(context, path, outline, null, {
    strokeStyle: '#ffffff',
    lineWidth: '2',
  });

  const visitedDataMap = { ...dataMap.objects.countries };
  visitedDataMap.geometries = visitedDataMap.geometries.filter((geometry) => {
    const territory = territoriesById[geometry.id];
    if (!territory) {
      console.warn(
        `Territory id ${geometry.id} not found in the territory list.`
      );
      return false;
    }
    return !!visitedTerritories[territory.code];
  });

  drawFeatures(context, path, dataMap, visitedDataMap, {
    fillStyle: '#5ebe74',
  });

  drawFeatures(context, path, dataMap, visitedDataMap, {
    strokeStyle: '#ffffff',
    lineWidth: '0.7',
  });

  const nonVisitedDataMap = { ...dataMap.objects.countries };
  nonVisitedDataMap.geometries = nonVisitedDataMap.geometries.filter(
    (geometry) => {
      const territory = territoriesById[geometry.id];
      if (!territory) {
        console.warn(
          `Territory id ${geometry.id} not found in the territory list.`
        );
        return true;
      }
      return !visitedTerritories[territory.code];
    }
  );

  drawFeatures(context, path, dataMap, nonVisitedDataMap, {
    fillStyle: '#000000',
  });

  drawFeatures(context, path, dataMap, nonVisitedDataMap, {
    strokeStyle: '#ffffff',
    lineWidth: '0.7',
  });
};

export default {
  drawMapOnCanvas,
};
