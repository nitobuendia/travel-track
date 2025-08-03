<script setup>
  import { territoriesSet } from '../store/territory_data';
  import { visitedTerritories } from '../store/visited_territory_data';
  import { ref, watch } from 'vue';
  import SearchBar from './SearchBar.vue';

  const toggleVisitedTerritory = (territoryCode) => {
    const visitedState = visitedTerritories[territoryCode];
    visitedTerritories[territoryCode] = !visitedState;
  };

  const searchValue = ref('');
  let filteredTerritories = ref(territoriesSet);
  watch(searchValue, async (newSearchValue) => {
    if (!newSearchValue) {
      filteredTerritories = territoriesSet;
      return;
    }
    filteredTerritories = new Set(Array.from(territoriesSet).filter(
      (t) => t.name.toLowerCase().includes(searchValue.value.toLowerCase())));
  });
</script>

<template>
  <section id="territory-list">
    <SearchBar v-model:searchValue="searchValue" />
    <template
      v-for="territory of territoriesSet"
      :key="territory.id">
      <template v-if="filteredTerritories.has(territory)">
        <div
          :id="`territory-${territory.code}`"
          class="territory"
          @click="toggleVisitedTerritory(territory.code)">
          <span class="territory-name">{{ territory.name }}</span>
          <span
            v-if="visitedTerritories[territory.code]"
            class="territory-visited-status visited"
            >Visited</span
          >
          <span
            v-else
            class="territory-visited-status not-visited"
            >Not Visited</span
          >
        </div>
      </template>
    </template>
  </section>
</template>

<style scoped>
  #territory-list {
    display: table;
    margin-top: 3rem;
    margin-left: 3rem;
    margin: 3rem auto;
  }

  .territory {
    cursor: pointer;
    display: table-row;
  }

  .territory:nth-child(odd) {
    background-color: var(--color-dark-gray-alternate);
  }

  .territory-name {
    display: table-cell;
    padding: 1rem;
    margin-right: 2rem;
    max-width: 30rem;
  }

  .territory-visited-status {
    display: table-cell;
    width: 12rem;
  }

  .territory-name:before {
    font-size: 80%;
    margin-right: 0.5rem;
  }

  .territory-visited-status.visited {
    color: var(--color-green);
  }

  .territory-visited-status.not-visited {
    color: var(--color-red);
  }

  .territory:has(.not-visited) .territory-name:before {
    content: '🔴';
  }

  .territory:has(.visited) .territory-name:before {
    content: '🟢';
  }

  @media only screen and (max-width: 750px) {
    .territory-name {
      width: 20rem;
    }
  }
</style>
