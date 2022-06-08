<template>
  <div class="flex-1 flex flex-col items-center justify-start">
    <div class="h-full w-full p-4 lg:max-w-5xl">
      <div class="tags flex flex-wrap">
        <div class="mr-4">全部</div>
        <div v-for="tag in tags" :key="tag._id">{{ tag.tag }}</div>
      </div>
      <div class="toolbar flex">
        <TextEditor
          rootclass="flex-1 my-4"
          v-model:text="search"
          placeholder="请输入要搜索的内容"
        ></TextEditor>
        <button class="ml-4">最新发布</button>
        <button class="ml-4">最新评论</button>
        <button class="ml-4">最高热度</button>
      </div>
      <div class="posts">
        <div v-for="post in posts" :key="post._id">
          <router-link :to="`/reader?cid=${post.cid}`">{{
            post.title
          }}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TextEditor from "../components/DivTextEditor.vue";
import { mapState } from "vuex";
export default {
  components: {
    TextEditor,
  },
  data: () => ({
    search: "",
  }),
  computed: mapState({
    posts: (state) => state.posts,
    tags: (state) => state.tags,
  }),
  async mounted() {
    this.$store.dispatch("listPosts");
    this.$store.dispatch("listTags");
  },
  watch: {
    search() {
      console.log("search changed!", this.search);
    },
  },
  methods: {},
};
</script>
