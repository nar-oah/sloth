<template>
  <uni-card
    v-for="(item, index) in writs.filter((writ: Writ) => !writ.parts.length)"
    :key="index"
    :title="item.name"
    :extra="`${differenceInDays(item.due, currentDate) + 1}天后`"
  >
    <view class="advance">
      <view>提前安排该任务</view>
      <uni-icons
        type="arrow-right"
        size="24"
        color="#007aff"
        @click="handleAdvance(index)"
      ></uni-icons>
    </view>
  </uni-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { differenceInDays } from "date-fns";
import { sloth } from "@/sdk/db";
import type { Writ } from "@/sdk/db";
import { callTodo } from "@/sdk/call";

const currentDate = new Date();
const writs = ref<Writ[]>(sloth.value.writ);

function handleAdvance(emptyID: number) {
  const emptyIndex: number[] = [];
  sloth.value.writ.forEach((writ: Writ, index: number) => {
    if (!writ.parts.length) emptyIndex.push(index);
  });
  console.log(emptyIndex[emptyID]);

  callTodo(emptyIndex[emptyID]);
}
</script>

<style lang="scss">
.advance {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
