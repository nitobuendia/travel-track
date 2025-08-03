<script setup>
  // import { computed } from 'vue';
  import { computed, nextTick, ref, watch } from 'vue';

  const ALPHABET = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

  const currentInViewLetter = defineModel('currentInViewLetter', {
    default: '',
    type: String,
  });
  const emit = defineEmits(['update:currentInViewLetter']);

  const letterIsActive = {};
  ALPHABET.forEach((letter) => {
    letterIsActive[letter] = ref(currentInViewLetter === letter);
  });
  watch(currentInViewLetter, (newLetter, oldLetter) => {
    letterIsActive[oldLetter].value = false;
    letterIsActive[newLetter].value = true;
  });

  /** Scrolls to the heading for the selected letter. */
  const scrollToCountryLetter = (letter) => {
    const headingForLetter = document.getElementById(letter);
    headingForLetter?.scrollIntoView({ behavior: 'smooth' });
  }
</script>

<template>
  <nav id="country-alphabet-menu">
    <ul>
      <li
        v-for="[letter, isActive] of Object.entries(letterIsActive)"
        :key="letter"
      >
        <a
          :href="'#' + letter"
          :class="{active: isActive.value}"
          @click.prevent="scrollToCountryLetter(letter)"
        >{{ letter }}</a>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
  #country-alphabet-menu {
    color: var(--color-white);
    position: fixed;
    right: 4em;
    transform: translateY(-50%);
    top: 50%;
    width: 2em;
    z-index: 1000;
  }

  a {
    color: var(--color-white);
    text-decoration: none;

    &.active {
      color: var(--color-green);
      font-size: 3em;
    }
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    display: block;
    list-style: none;
    padding: 0.2em 0;
    text-align: center;

    &:has(a.active) {
      padding: 1em 0;
    }
  }

  .active {
    font-size: 5em;
  }
</style>
