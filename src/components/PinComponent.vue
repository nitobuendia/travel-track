
<template>
  <button
    id="pin-element"
    v-on:click="$event.target.classList.toggle('sticky')"
  >📌</button>
</template>

<style>
#pin-element {
  background: transparent;
  border: none;
  clear: right;
  cursor: pointer;
  filter: saturate(0);
  float: right;
  margin-right: 1em;
}

#pin-element.sticky {
  filter: saturate(100);
}
</style>
