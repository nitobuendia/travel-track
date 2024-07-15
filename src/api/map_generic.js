
import * as d3_geo from 'd3-geo';
import * as d3_fetch from 'd3-fetch';

// TODO: import data instead of relying on CDN.
const WORLD_MAP = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';
// const WORLD_MAP = ''https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json';

const calculateCanvasHeight = (projection, mesh) => {
  const [[x0, y0], [x1, y1]] = d3_geo.geoPath(projection).bounds(mesh);
  const dy = Math.ceil(y1 - y0);
  const l = Math.min(Math.ceil(x1 - x0), dy);
  projection.scale((projection.scale() * (l - 1)) / l).precision(0.2);
  return dy;
};

const loadJsonDataMap = async (mapUrl) => {
  return await d3_fetch.json(mapUrl);
};

export default {
  WORLD_MAP,
  calculateCanvasHeight,
  loadJsonDataMap,
};
