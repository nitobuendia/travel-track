<script setup>
  import Header from '../components/Header.vue';
  import Footer from '../components/Footer.vue';
  import TerritoryStats from '../components/TerritoryStats.vue';
  import TerritoryList from '../components/TerritoryList.vue';
  import TerritoryMap from '../components/TerritoryMap.vue';
</script>

<template>
  <Header />
  <TerritoryMap />
  <TerritoryStats />
  <TerritoryList />
  <Footer />
</template>
