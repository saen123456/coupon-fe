<template>
  <div
    class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
  >
    <a href="#">
      <img
        class="p-8 rounded-t-lg"
        :src="
          product.image ??
          'https://www.apple.com/v/iphone/home/bv/images/overview/select/iphone_15_pro__bpnjhcrxofqu_large_2x.png'
        "
        alt="product image"
      />
    </a>
    <div class="px-5 pb-5">
      <a href="#">
        <h5
          class="text-xl font-semibold tracking-tight text-gray-900 dark:text-white"
        >
          {{ product.name }} จำนวนคงเหลือ {{ product.stock }}
        </h5>
      </a>
      <article class="text-overflow">
        <p class="break-words whitespace-normal max-w-full">
          {{ product.description }}
        </p>
      </article>
      <div class="flex items-center justify-between">
        <span class="text-3xl font-bold text-gray-900 dark:text-white"
          >{{ product.price }} บาท</span
        >
        <TwModal backdrop="static" :full-height="false">
          <template #trigger>
            <TwButton
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              ซื้อ
            </TwButton>
          </template>
          <template #header>
            <div>กรอกรหัสคูปอง</div>
          </template>
          <template #body>
            <div>
              <!-- Add @submit.prevent to the form -->
              <form @submit.prevent="usageCoupon">
                <div class="mb-6">
                  <label
                    for="coupon_code"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >กรอกรหัสคูปอง</label
                  >
                  <input
                    v-model="couponCode"
                    type="text"
                    id="coupon_code"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="กรอกรหัสคูปอง"
                    required
                  />
                  <p v-if="error" class="text-red-500 text-sm mt-2">
                    {{ error }}
                  </p>
                </div>
                <!-- Remove @click from button since form submit is handled -->
                <button
                  type="submit"
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  ยืนยันการสั่งซื้อ
                </button>
              </form>
            </div>
          </template>

          <!-- <template #footer>
            <div>Footer</div>
          </template> -->
        </TwModal>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import dayjs from "dayjs";
import axios from "axios";
import TwModal from "../modal/TwModal.vue";

export default {
  components: {
    TwModal,
  },
  name: "ProductList",
  props: {
    product: {
      type: Object,
    },
  },
  setup() {
    const couponCode = ref(""); // Initialize couponCode inside setup
    const loading = ref(true); // Loading state
    const error = ref(null); // Error state
    const modalRef = ref(null); // Reference to TwModal component

    const formatExpiryDate = (date) => {
      return dayjs(date).format("YYYY-MM-DD HH:mm");
    };

    const usageCoupon = async () => {
      // console.log(couponCode.value); // Use couponCode.value to access the ref value
      // alert(couponCode.value);
      try {
        const body = {
          code: couponCode.value,
        };
        const response = await axios.put(
          `${import.meta.env.VITE_API_ENDPOINT}/coupon/update/usage`,
          body
        );
        // modalRef.value.closeModal();
        window.location.reload();
      } catch (err) {
        error.value = "คุณกรอกรหัสคูปองผิด";
        console.error(err, err.status);
        // alert(error.value);
      } finally {
        loading.value = false;
      }
    };

    return {
      couponCode, // Make couponCode available in the template
      formatExpiryDate,
      usageCoupon,
      error,
    };
  },
};
</script>
