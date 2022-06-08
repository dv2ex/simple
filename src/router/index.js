import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PostsView from "../views/PostsView.vue";
import NewPostView from "../views/NewPostView.vue";
import ReaderView from "../views/ReaderView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/postnew",
    component: NewPostView,
  },
  {
    path: "/list",
    component: PostsView,
  },
  {
    path: "/reader",
    component: ReaderView,
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

export default router;
