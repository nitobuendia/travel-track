<script setup>
import { ref, watch } from 'vue';
import { territoryMetadata } from '../store/territory_data';
import { visitedTerritories } from '../store/visited_territory_data';
import PinComponent from './PinComponent.vue';

const visitedCount = ref(visitedTerritories.visitedCount);
const visitedPercentage = ref(visitedTerritories.visitedPercentage);

watch(visitedTerritories, () => {
  visitedCount.value = visitedTerritories.visitedCount;
  visitedPercentage.value = visitedTerritories.visitedPercentage;
});
</script>

<template>
  <section id="territory-stats">
    <div
      class="container"
      :style="'--progress:' + visitedPercentage + '%;'"
    >
      <PinComponent />
      <h1>Your Progress</h1>
      <div>
        <span class="highlight">{{ visitedCount }}</span>
        /
        {{ territoryMetadata.size }}
        <br />
        <span class="subtitle">{{ territoryMetadata.memberName }}</span>
      </div>
      <div>
        <span class="highlight">{{ visitedPercentage }}</span
        >%
        <br />
        <span class="subtitle">of {{ territoryMetadata.name }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
#territory-stats {
  display: flex;
  justify-content: center;
}

#territory-stats:has(.sticky) {
  position: sticky;
  top: 0;
}

*:has(.sticky) + #territory-stats:has(.sticky) {
  top: 500px;
}

.container {
  align-items: flex-end;
  background: var(--color-gray);
  border: 1px solid #fff;
  border-radius: 1rem;
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.3);
  color: var(--color-white);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 1rem 1rem 4rem 1rem;
  text-align: center;
  text-transform: uppercase;
  width: 48rem;

  position: relative;
  overflow: hidden;
}

.container::before {
  background: linear-gradient(
    to right,
    var(--color-green) var(--progress),
    var(--color-dark-gray-alternate) var(--progress)
  );
  border-radius: 1rem;
  border: 1px solid var(--color-white);
  box-shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.3);
  content: ' ';
  display: block;
  height: 2rem;
  left: 1rem;
  position: absolute;
  bottom: 1rem;
  width: calc(100% - 2rem);
}

.container h1 {
  flex: 2;
  flex-direction: column;
  flex-basis: 100%;
  margin: 1rem 0 2rem 0;
  padding: 0;
}

.container div {
  flex: 1;
  flex-direction: column;
}

.highlight {
  color: var(--color-green);
  font-size: 2rem;
}

.subtitle {
  color: var(--color-light-gray);
  font-size: 0.8rem;
}
</style>
