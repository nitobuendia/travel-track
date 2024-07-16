import territoryData from '../data/world.json';

const territoriesSet = new Set();
const territoriesByCode = {};
const territoriesById = {};

const territories = territoryData.territories;
territories.forEach((territory) => {
  const frozenTerritory = Object.freeze(territory);
  territoriesSet.add(frozenTerritory);
  territoriesByCode[territory.code] = frozenTerritory;
  territoriesById[territory.id] = frozenTerritory;
});

territoriesSet.add = undefined;
territoriesSet.delete = undefined;
territoriesSet.clear = undefined;

Object.freeze(territoriesByCode);
Object.freeze(territoriesById);

const territoryMetadata = Object.freeze({
  id: territoryData.id,
  size: territoriesSet.size,
  name: territoryData.name,
  memberName: territoryData.memberName,
});

export {
  territoryMetadata,
  territoriesSet,
  territoriesByCode,
  territoriesById,
};
