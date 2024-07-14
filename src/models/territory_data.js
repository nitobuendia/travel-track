import territoryData from '../data/world.json';
import { reactive } from 'vue';

const territoryMetadata = Object.freeze({
  id: territoryData.id,
  name: territoryData.name,
  memberName: territoryData.memberName,
});

const territories = territoryData.territories;
const territoriesSet = new Set(
  territories.map((territory) => {
    return Object.freeze(territory);
  })
);
territoriesSet.add = undefined;
territoriesSet.delete = undefined;
territoriesSet.clear = undefined;

// Visited territories.
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
        (100 * Object.keys(territories).length) / territoriesSet.size
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
  }

  deleteProperty(territories, key) {
    delete territories[key];
    localStorage.setItem(_LOCAL_STORAGE_KEY, JSON.stringify(territories));
  }
}

const visitedTerritoriesHandler = new WorldTerritoryHandler(this);
const visitedTerritoriesProxy = new Proxy(
  visitedTerritories,
  visitedTerritoriesHandler
);
const visitedTerritoriesStore = reactive(visitedTerritoriesProxy);

export {
  territoryMetadata,
  territoriesSet as territories,
  visitedTerritoriesStore as visitedTerritories,
};
