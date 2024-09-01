<!-- App.vue -->
<template>
  <div id="app">
    <div class="mb-5">
      <HeaderNavbar />
      <h1 class="mt-5 ml-5 mr-5">Code</h1>
      <div
        v-if="!loading && couponsData.length"
        class="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-5 mb-5 ml-5 mr-5"
      >
        <div v-for="coupon in couponsData" :key="coupon.id">
          <CardList :coupon="coupon" />
        </div>
        <!-- <CardList />
        <CardList />
        <CardList />
        <CardList /> -->
      </div>
    </div>
    <!-- Add router-view here, so routed components render appropriately -->
    <router-view />

    <!-- You can conditionally render product cards or other components if needed -->
    <!-- Consider using a route guard or conditional rendering if needed -->
    <div
      v-if="!isAdminRoute"
      class="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ml-5 mr-5"
    >
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
      <ProductCard />
    </div>

    <div class="mt-5">
      <FooterNavbar />
    </div>
  </div>
</template>

<script>
import HeaderNavbar from "./components/navbar/header.vue";
import FooterNavbar from "./components/navbar/footer.vue";
import ProductCard from "./components/product/Product.vue";
import CardList from "./components/card/CardList.vue";
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

export default {
  components: {
    HeaderNavbar,
    FooterNavbar,
    ProductCard,
    CardList,
  },
  setup() {
    const couponsData = ref([]); // Array to hold fetched data
    const loading = ref(true); // Loading state
    const error = ref(null); // Error state
    const route = useRoute();

    // Fetch data when the component is mounted
    onMounted(async () => {
      try {
        const response = await axios.get(
          "https://localhost:7284/api/coupon/lists"
        );
        couponsData.value = response.data; // Set data from the response
      } catch (err) {
        error.value = "Failed to load data";
        console.error(err);
      } finally {
        loading.value = false;
      }
    });

    const isAdminRoute = computed(() => route.path.startsWith("/admin"));

    return {
      isAdminRoute,
      couponsData,
      loading,
      error,
    };
  },
};
</script>
