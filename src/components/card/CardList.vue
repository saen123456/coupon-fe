<template>
  <a
    href="#"
    class="block max-w-sm p-6 bg-cyan-100 border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
  >
    <!-- Display coupon details -->
    <h5
      class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
    >
      {{ coupon.code }}
    </h5>
    <p class="font-normal text-gray-700 dark:text-white-400">
      วันหมดอายุ: {{ formatExpiryDate(coupon.expires_at) }}
    </p>
    <p class="font-normal text-gray-700 dark:text-white-400">
      จำนวนการใช้: {{ coupon.usage_count }}
    </p>
  </a>
</template>

<script>
import dayjs from "dayjs";
export default {
  name: "CardList",
  props: {
    coupon: {
      type: Object,
      // required: true,
    },
  },
  methods: {
    formatExpiryDate(date) {
      // Log the date to debug
      return dayjs(date).format("YYYY-MM-DD HH:mm");
    },
  },
};
</script>
