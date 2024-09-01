<template>
  <div id="app">
    <div class="mb-5">
      <HeaderNavbar />
      <div class="inline-flex rounded-md shadow-sm ml-5 mt-5" role="group">
        <button
          @click="generateNewCoupon"
          type="button"
          class="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          Generate New Coupon
        </button>
      </div>

      <div
        v-if="!loading && couponsData.length"
        class="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 mt-5 mb-5 ml-5 mr-5"
      >
        <div v-for="coupon in couponsData" :key="coupon.id">
          <CardList :coupon="coupon" />
        </div>
      </div>
    </div>
    <router-view />
    <div
      v-if="!isAdminRoute"
      class="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ml-5 mr-5"
    >
      <div v-for="product in productsData" :key="product.id">
        <ProductCard :product="product" />
      </div>
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
    const productsData = ref([]); // Array to hold fetched data
    const loading = ref(true); // Loading state
    const error = ref(null); // Error state
    const route = useRoute();

    // Fetch data when the component is mounted
    onMounted(async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/coupon/lists`
        );

        const responseFromProducts = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/product/lists`
        );

        couponsData.value = response.data; // Set data from the response
        productsData.value = responseFromProducts.data; // Set data from the response
      } catch (err) {
        error.value = "Failed to load data";
        console.error(err);
      } finally {
        loading.value = false;
      }
    });

    const isAdminRoute = computed(() => route.path.startsWith("/admin"));

    // Define the method inside setup
    const generateNewCoupon = async () => {
      loading.value = true; // Set loading to true while generating
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}/coupon/generate`
        );
        couponsData.value = response.data; // Update data with the new list
      } catch (err) {
        error.value = "Failed to create new coupon";
        console.error(err);
      } finally {
        loading.value = false; // Stop loading
      }
    };

    return {
      isAdminRoute,
      couponsData,
      productsData,
      loading,
      error,
      generateNewCoupon, // Return the method to use in the template
    };
  },
};
</script>
