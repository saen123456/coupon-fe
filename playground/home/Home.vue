<script setup lang="ts">


// import HeaderNavbar from "";

import { TwToggle, TwDialog } from "/src/build";
import { onMounted, ref, watch } from "vue";

const dark = ref(false);
watch(dark, (value) => {
  if (value) {
    document.body.setAttribute("data-theme", "dark");
  } else {
    document.body.setAttribute("data-theme", "light");
  }
});

onMounted(async () => {
  const windowPreferenceDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (windowPreferenceDark) {
    document.body.setAttribute("data-theme", "dark");
  } else {
    document.body.setAttribute("data-theme", "light");
  }
});
</script>

<template>
  <!-- <HeaderNavbar /> -->
  <h1>Hello App!</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/product">Go to About</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main>
</template>
