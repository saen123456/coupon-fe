<script setup lang="ts">
import HeaderNavbar from "../../components/navbar/header.vue";
import ProductCard from "../../components/product/Product.vue";

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
  <div class="mb-5">
    <HeaderNavbar />
  </div>
  <div class="grid grid-cols-5 gap-4">
    <ProductCard />
    <ProductCard />
    <ProductCard />
    <ProductCard />
    <ProductCard />
    <ProductCard />
    <ProductCard />
  </div>
  <!-- <h1>Hello App!</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <RouterLink to="/">Go to Home</RouterLink>
    <RouterLink to="/product">Go to About</RouterLink>
  </nav>
  <main>
    <RouterView />
  </main> -->
</template>
