<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { getOverdue } from "./sdk/db";
import { callTodo } from "./sdk/call";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
  getOverdue().forEach((writId: number) => callTodo(writId));
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style>
/* App.vue */
/* 隐藏所有页面的滚动条 */

/* 针对 Webkit 内核的浏览器 (Chrome, Safari, Android/iOS Webview) */
::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  -webkit-appearance: none;
  background: transparent;
  color: transparent;
}

/* 针对 Firefox */
html {
  scrollbar-width: none;
}

page {
  background-color: #36282b;
}
</style>
