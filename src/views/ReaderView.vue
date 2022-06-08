<template>
  <div class="flex-1 flex flex-col items-center justify-start">
    <div class="h-full w-full p-4 lg:max-w-5xl">
      <div class="text-xl font-bold p-2">{{ post.title }}</div>
      <div class="flex flex-wrap">
        <div v-for="tag in post.tags" :key="tag" class="p-2">{{ tag }}</div>
      </div>
      <template v-for="(p, idx) in post.body">
        <div
          v-if="'text' in p"
          :key="`p-${idx}`"
          class="px-2 mt-4 leading-8 text-justify indent-8"
        >
          {{ p.text }}
        </div>
        <img
          v-if="p.mime && p.mime.startsWith('image')"
          :key="`p-${idx}-${p.cid}`"
          :data-cid="p.cid"
          class="w-full mt-4"
        />
        <video
          v-if="p.mime && p.mime.startsWith('video')"
          :key="`p-${idx}-${p.cid}`"
          :data-cid="p.cid"
          :data-name="p.name"
          preload="true"
          controls
          class="w-full mt-4"
        ></video>
        <audio
          v-if="p.mime && p.mime.startsWith('audio')"
          :key="`p-${idx}-${p.cid}`"
          :data-cid="p.cid"
          :data-name="p.name"
          preload="true"
          controls
          class="w-full mt-4"
        ></audio>
      </template>
    </div>
  </div>
</template>
<script>
import { RPC } from "@/store/api";
export default {
  data: () => ({
    post: {},
  }),
  methods: {
    async updateMediaTag() {
      const nodes = document.querySelectorAll("img");
      for (let node of [...nodes]) {
        if (node.getAttribute("data-cid") && !node.getAttribute("src")) {
          node.src = await this.cid2url(node.getAttribute("data-cid"));
          node.onload = function () {
            URL.revokeObjectURL(this.src);
          };
        }
      }
      let videos = document.querySelectorAll("video");
      for (let video of [...videos]) {
        if (video.getAttribute("data-cid") && !video.getAttribute("src")) {
          video.src = await this.cid2url(video.getAttribute("data-cid"));
        }
      }
      let audios = document.querySelectorAll("audio");
      for (let audio of [...audios]) {
        if (audio.getAttribute("data-cid") && !audio.getAttribute("src")) {
          audio.src = await this.cid2url(audio.getAttribute("data-cid"));
        }
      }
    },
  },
  async mounted() {
    this.post = await RPC("loadJSON", [
      `/ipfs/${this.$route.query.cid}/meta.json`,
    ]);
    this.$nextTick(() => {
      this.updateMediaTag();
    });
  },
};
</script>
