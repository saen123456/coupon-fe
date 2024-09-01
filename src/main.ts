import { createApp, type Directive } from "vue";
import "flowbite";
import App from "./App.vue";

import "../src/assets/dev/main.css";
import { useForm } from "../src/composables/form";
import Ripple from "../src/directives/ripple";
import ClickOutside from "../src/directives/clickOutside";
import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
} from "vue-router";
import HomeView from "./views/home/Home.vue";
import ProductView from "./views/product/Product.vue";
import AdminHomeView from "./views/admin/Home.vue";

const routes = [
  // { path: "/", component: HomeView },
  { path: "/product", component: ProductView },
  { path: "/admin/home", component: AdminHomeView },
];

const router = createRouter({
  history: createWebHistory(), // Change this line
  routes,
});

const app = createApp(App).use(router);

Ripple.color = "rgba(255, 255, 255, 0.35)";
Ripple.zIndex = "55";
app.directive("click-outside", ClickOutside as Directive<any, any>);
app.directive("ripple", Ripple as Directive<any, any>);

const form = useForm();
form.setCustomRules({
  test({ value }) {
    if (value === "test") return "test";
  },
});

form.setGlobalCustomValidatorErrorMessage({
  ["required"]: "Field {field} wajib diisi!",
});

app.mount("#app");
