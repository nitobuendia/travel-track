<template>
  <section>
    <input
      type="text"
      placeholder="Enter territory name to filter..."
      v-model="searchValue"
      @input="emit('update:searchValue', $event.target.value)"
      @keyup.enter="emit('update:searchValue', $event.target.value)"
    />
  </section>
</template>

<script setup>
const searchValue = defineModel('searchValue')
const emit = defineEmits(['update:searchValue']);
</script>

<style scoped>
section {
  display: flex;
  margin: 0 0 1.5rem 0;
  padding: 0;
  justify-content: center;
}

input {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s;
}

input:focus {
  border-color: var(--color-green, #4caf50);
}
</style>
