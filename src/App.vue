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
<style></style>
