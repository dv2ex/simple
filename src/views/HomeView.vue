<template>
  <div class="flex-1 flex-col flex items-center justify-center">
    <div class="text-center flex-1 flex items-center justify-center flex-col">
      <div
        v-if="mode === 'welcome'"
        class="flex items-center justify-center flex-col"
      >
        <div
          style="border-top-color: transparent"
          class="mb-12 w-8 h-8 border-4 border-blue-400 border-solid rounded-full animate-spin"
        ></div>
        <div>Nobody should && nobody can<br />make you be quiet</div>
      </div>
      <div v-if="mode === 'postnew'" class="leading-8">
        hello <span class="font-bold">{{ me ? me.nickname : "unknown" }}</span
        ><br />首次准备帖子列表需要一点时间，您可以先发一个帖子<br />千里之行，始于足下
      </div>
      <router-link
        v-if="mode === 'postnew'"
        to="/postnew"
        class="mt-8 bg-slate-300 px-4 py-1 rounded hover:bg-slate-400"
      >
        Post New
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { RPC } from "@/store/api";
export default {
  name: "HomeView",
  data: () => ({
    mode: "welcome",
    username: "",
  }),
  computed: mapState({
    posts: (state) => state.posts,
    me: (state) =>
      state.currentUser >= 0 ? state.users[state.currentUser] : null,
  }),
  async mounted() {
    for (let i = 0; i < 10; i++) {
      await this.sleep(1000);
      await this.$store.dispatch("listPosts");
      if (this.posts.length <= 0) {
        continue;
      } else {
        // jump to list post list page
        this.$router.replace("/list");
        return;
      }
    }
    await this.$store.dispatch("listUser");
    if (!this.me) {
      await RPC("newUser", ["newuser"]);
      await this.$store.dispatch("listUser");
    }
    this.mode = "postnew";
  },
};
</script>
