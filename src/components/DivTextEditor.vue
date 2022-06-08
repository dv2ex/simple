<template>
  <div :class="rootclass">
    <div class="relative">
      <div :style="placeholderStyle" class="text-slate-400">
        {{ placeholder }}
      </div>
      <div
        @input="oninput"
        @keydown="onkey"
        contenteditable
        ref="editor"
        :style="editorStyle"
        @blur="fixState"
        class="focus:outline-none editor"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["rootclass", "placeholder", "text", "selstart", "multiline"],
  data: () => ({
    innerText: "",
    editorStyle: {},
    placeholderStyle: {},
  }),
  mounted() {
    this.innerText = this.text;
    this.$refs.editor.innerText = this.innerText;
    this.updateStyle();
  },
  watch: {
    text() {
      if (this.text !== this.innerText) {
        this.innerText = this.text;
        this.$refs.editor.innerText = this.innerText;
      }
    },
    innerText(newvalue, old) {
      if (newvalue && !old) {
        this.placeholderStyle = {
          display: "none",
        };
        this.editorStyle = {
          position: "relative",
          width: "auto",
          height: "auto",
        };
      } else if (old && !newvalue) {
        this.placeholderStyle = {
          display: "block",
        };
        this.editorStyle = {
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
          whiteSpace:
            typeof this.multiline !== "undefined" ? "normal" : "nowrap",
        };
      }
    },
  },
  methods: {
    updateStyle() {
      if (this.innerText) {
        this.placeholderStyle = {
          display: "none",
        };
        this.editorStyle = {
          position: "relative",
          width: "auto",
          height: "auto",
        };
      } else {
        this.placeholderStyle = {
          display: "block",
        };
        this.editorStyle = {
          position: "absolute",
          left: 0,
          top: 0,
          width: "100%",
          heith: "100%",
          whiteSpace:
            typeof this.multiline !== "undefined" ? "normal" : "nowrap",
        };
      }
    },
    updateValue() {
      const { anchorNode, anchorOffset } = window.getSelection();
      let result = "";
      let position = 0;
      if (!this.$refs.editor) return;
      for (let child of this.$refs.editor.childNodes) {
        if (result) result += "\n";
        if (child === anchorNode || child === anchorNode.parentNode) {
          position = result.length + anchorOffset;
        }
        result += child.textContent;
      }
      this.innerText = result;
      this.$emit("update:text", result);
      this.$emit("update:selstart", position);
      this.$emit("change");
    },
    onkey(evt) {
      if (evt.key === "Enter") {
        if (typeof this.multiline === "undefined") {
          evt.stopPropagation();
          evt.preventDefault();
          this.$refs.editor.blur();
        }
      }
    },
    oninput() {
      this.updateValue();
    },
    fixState() {
      this.updateValue();
      this.updateStyle();
      this.$emit("blur");
    },
  },
};
</script>
<style>
.editor div {
  margin-top: 1em;
}
</style>
