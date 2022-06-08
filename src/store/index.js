import { createStore } from "vuex";
import { RPC } from "./api";

export default createStore({
  state: {
    posts: [],
    tags: [],
    users: [],
    currentUser: -1,
  },
  getters: {},
  mutations: {
    appendPosts(state, payload) {
      for (let post of payload) {
        if (state.posts.filter((v) => v.ipns === post.ipns).length <= 0) {
          state.posts.push(post);
        }
      }
      state.posts = [...state.posts];
    },
    setTags(state, payload) {
      state.tags = payload;
    },
    setUsers(state, payload) {
      state.users = payload;
      if (state.currentUser < 0 || state.currentUser >= payload.length) {
        state.currentUser = 0;
      }
    },
  },
  actions: {
    async listUser({ commit }) {
      const result = await RPC("listUser");
      commit("setUsers", result);
    },
    async listPosts({ commit }) {
      const result = await RPC("listPosts");
      commit("appendPosts", result.rows);
    },
    async listTags({ commit }) {
      const result = await RPC("listTags");
      commit("setTags", result.rows);
    },
  },
  modules: {},
});
