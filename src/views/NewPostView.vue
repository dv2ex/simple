<template>
  <div class="flex-1 flex flex-col items-center justify-start">
    <div class="h-full w-full p-4 lg:max-w-5xl">
      <TextEditor
        placeholder="请在这里输入帖子的标题"
        :rootclass="['text-xl', 'font-bold', 'antialiased', 'p-2']"
        v-model:text="title"
      />
      <div class="flex flex-wrap">
        <TextEditor
          v-for="(tag, idx) in tags"
          v-model:text="tags[idx]"
          :key="`tag-${idx}`"
          rootclass="p-2"
          placeholder="新标签"
        />
        <TextEditor
          @blur="appendTag"
          v-model:text="newTag"
          rootclass="p-2"
          placeholder="新标签"
        />
      </div>
      <template v-for="(p, idx) in body">
        <TextEditor
          v-if="'text' in p"
          :key="`p-${idx}`"
          placeholder="千里之行，始于足下，在这里开始您的写作"
          ref="body"
          rootclass="px-2 mt-4 leading-8 text-justify indent-8"
          @change="setFocus(idx)"
          @blur="formatOnBlur"
          v-model:text="body[idx].text"
          v-model:selstart="body[idx].selstart"
          multiline
        />
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

      <div class="mt-8 flex justify-center items-center w-full">
        <label
          for="dropzone-file"
          class="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 border-dashed cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div class="flex flex-col justify-center items-center pt-5 pb-6">
            <svg
              class="mb-3 w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="font-semibold">点击添加附件</span> 或者拖拽至此
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              MP3, MP4, JPG or PNG
            </p>
          </div>
          <input
            @change="attachFiles"
            id="dropzone-file"
            type="file"
            class="hidden"
          />
        </label>
      </div>
      <div class="flex items-center justify-start mt-8">
        <button
          @click="doPublish"
          class="bg-slate-300 px-6 py-3 rounded hover:bg-slate-400 mr-8"
        >
          发布
        </button>
        <div v-if="error" class="text-red-700 px-4 py-3" role="alert">
          <strong class="font-bold">出错了:</strong>
          <span class="block sm:inline">{{ error }}</span>
        </div>
        <div v-if="msg" class="text-blue-700 px-4 py-3" role="alert">
          <span class="block sm:inline">{{ msg }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { RPC } from "@/store/api";
import TextEditor from "../components/DivTextEditor.vue";

export default {
  data: () => ({
    focusP: 0,
    error: "",
    msg: "",
    title: "",
    newTag: "",
    tags: [],
    body: [{ text: "", selstart: 0 }],
  }),
  components: {
    TextEditor,
  },
  computed: mapState({
    me: (state) =>
      state.currentUser >= 0 ? state.users[state.currentUser] : null,
  }),
  methods: {
    async doPublish() {
      if (!this.me) {
        this.error = "who are you?";
        return;
      }
      if (!this.title) {
        this.error = "请给你的帖子增加一个标题";
        return;
      }
      const body = this.body.filter((p) => p.text !== "");
      if (body.length === 0) {
        this.error = "请给你的帖子添加一些内容";
        return;
      }
      this.error = "";
      this.msg = "正在发布，请稍后...";
      this.post = await RPC("updateUserPost", [
        this.me.userid,
        this.post ? this.post.postid : null,
        {
          ...(this.post || {}),
          title: this.title,
          body: this.body,
          tags: this.tags.filter((tag) => tag),
          draft: false,
        },
      ]);
      this.$router.replace("/list");
    },
    appendTag() {
      if (this.newTag) {
        for (const tag of this.tags) {
          if (tag === this.newTag) return;
        }
        this.tags.push(this.newTag);
        this.newTag = "";
      }
    },
    formatOnBlur() {
      this.formatBody();
    },
    setFocus(idx) {
      this.focusP = idx;
    },
    /**
     * 格式化body，如果pieces.length不为空，则将其插入在focus的地方，
     * 插入空白以便于添加文字
     *
     */
    formatBody(pieces = []) {
      let result = [];
      if (this.body.length == 0) {
        this.body = [{ text: "", selstart: 0 }];
        this.focusP = 0;
      }
      //格式化插入的内容
      for (let idx in this.body) {
        const p = this.body[idx];
        if ("text" in p) {
          if (pieces.length > 0 && idx == this.focusP) {
            const { text, selstart } = p;
            if (selstart === 0) {
              //光标在当前段落开始，这种情况
              result = [
                ...result,
                ...pieces,
                //如果text内部已经分段，则也将其分为不同的段落
                ...text
                  .split("\n")
                  .map((s) => ({ text: s.trim(), selstart: 0 })),
              ];
            } else if (selstart === text.length) {
              //光标处于段落的末尾
              result = [
                ...result,
                ...text
                  .split("\n")
                  .map((s) => ({ text: s.trim(), selstart: 0 })),
                ...pieces,
              ];
            } else {
              //光标处于中间
              const half0 = text.slice(0, selstart);
              const half1 = text.slice(selstart);
              result = [
                ...result,
                ...half0
                  .split("\n")
                  .map((s) => ({ text: s.trim(), selstart: 0 })),
                ...pieces,
                ...half1
                  .split("\n")
                  .map((s) => ({ text: s.trim(), selstart: 0 })),
              ];
            }
          } else {
            //对于其他情况，只格式化文本就可以
            result = [
              ...result,
              ...p.text
                .split("\n")
                .map((s) => ({ text: s.trim(), selstart: 0 })),
            ];
          }
        } else {
          //对于不是文本的情况，则直接放入结果就可以
          result.push(p);
        }
      }

      //插入空白
      if (result.length === 0 || !("text" in result[0])) {
        //如果body为空，则插入一个空段落
        result.splice(0, 0, { text: "", selstart: 0 });
      }
      for (let idx = 0; ; ) {
        //如果当前段落不是text，并且后一段也不是text或者已经是最后一段，则需要插入空的text
        if (
          !("text" in result[idx]) &&
          (idx === result.length - 1 || !("text" in result[idx + 1]))
        ) {
          result.splice(idx + 1, 0, { text: "", selstart: 0 });
          idx += 1;
        }
        idx++;
        if (idx >= result.length) break;
      }

      //移除连续的空段落
      let lastIsText = false;
      const result2 = [];
      for (let p of result) {
        if (!lastIsText || p.text !== "") {
          result2.push(p);
          lastIsText = "text" in p;
        }
      }

      this.body = result2;
    },
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
    async attachFiles(event) {
      if (!this.me) throw new Error("无当前用户");
      if (!this.post) {
        this.post = await RPC("updateUserPost", [
          this.me.userid,
          null,
          {
            title: this.title,
            body: this.body,
            draft: true,
          },
        ]);
      }
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = (error) => reject(error);
        });
      const filesP = [];
      for (let file of event.target.files) {
        const body = {};
        if (file.path) {
          // inside electron
          body.path = file.path;
        } else {
          body.binary = await toBase64(file);
        }
        const result = await RPC("attachPost", [
          this.me.userid,
          this.post.postid,
          [body],
        ]);
        filesP.push({
          cid: result[0],
          name: file.name,
          mime: file.type,
        });
      }
      this.formatBody(filesP);
      this.$nextTick(() => {
        this.updateMediaTag();
      });
    },
  },
};
</script>
