import { reactive } from 'vue';
import { territoryMetadata } from './territory_data';

const _LOCAL_STORAGE_KEY = 'travel-track-visited-territories';
const visitedTerritoriesCache = localStorage.getItem(_LOCAL_STORAGE_KEY);
const visitedTerritories = visitedTerritoriesCache
  ? JSON.parse(visitedTerritoriesCache)
  : {};
const visitedTerritoriesEntries = Object.entries(visitedTerritories);
for (const [territoryCode, territoryState] of visitedTerritoriesEntries) {
  if (!territoryState) delete visitedTerritories[territoryCode];
}

class WorldTerritoryHandler {
  get(territories, key) {
    if (key === 'visitedCount') return Object.keys(territories).length;
    if (key === 'visitedPercentage')
      return Math.round(
        (100 * Object.keys(territories).length) / territoryMetadata.size
      );
    return territories[key];
  }

  set(territories, key, value) {
    if (value) {
      territories[key] = value;
      localStorage.setItem(_LOCAL_STORAGE_KEY, JSON.stringify(territories));
    } else {
      this.deleteProperty(territories, key);
    }
    return true;  // Successful. Regardless of value;
  }

  deleteProperty(territories, key) {
    delete territories[key];
    localStorage.setItem(_LOCAL_STORAGE_KEY, JSON.stringify(territories));
    return true;  // Successful. Regardless of value;
  }
}

const visitedTerritoriesHandler = new WorldTerritoryHandler(this);
const visitedTerritoriesProxy = new Proxy(
  visitedTerritories,
  visitedTerritoriesHandler
);
const visitedTerritoriesStore = reactive(visitedTerritoriesProxy);

export {
  visitedTerritoriesStore as visitedTerritories,
};
