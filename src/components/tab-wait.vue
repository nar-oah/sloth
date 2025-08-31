<template>
  <uni-card
    v-for="(item, index) in writs.filter((writ: Writ) => !writ.parts.length)"
    :key="index"
    :extra="`${differenceInDays(item.due, currentDate) + 1}天后`"
  >
    <text class="uni-body">{{ item.name }}</text>
    <view slot="actions" class="card-actions">
      <view class="card-actions-item" @click="callTodo(getID(index))">
        <uni-icons type="paperplane-filled" size="18" color="#999"></uni-icons>
        <text class="card-actions-item-text">提前安排</text>
      </view>
      <view class="card-actions-item" @click="handleChange(index)">
        <uni-icons type="chatbubble-filled" size="18" color="#999"></uni-icons>
        <text class="card-actions-item-text">修改</text>
      </view>
      <view class="card-actions-item" @click="writs.splice(getID(index), 1)">
        <uni-icons type="trash-filled" size="18" color="#999"></uni-icons>
        <text class="card-actions-item-text">删除</text>
      </view>
    </view>
  </uni-card>

  <uni-popup ref="inputDialog" type="dialog">
    <uni-popup-dialog
      ref="inputClose"
      mode="input"
      title="输入内容"
      value="对话框预置提示内容!"
      placeholder="请输入内容"
      @confirm="handleConfirm($event)"
    ></uni-popup-dialog>
  </uni-popup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { differenceInDays } from "date-fns";
import { sloth } from "@/sdk/db";
import type { Writ } from "@/sdk/db";
import { callTodo } from "@/sdk/call";

const currentDate = new Date();
const writs = ref<Writ[]>(sloth.value.writ);
const inputDialog = ref();
const changeID = ref<number>(0);

function handleChange(id: number) {
  changeID.value = id;
  inputDialog.value.open();
}
function handleConfirm(value: string) {
  const id = getID(changeID.value);
  writs.value[id].name = value;
  inputDialog.value.close();
}
function getID(emptyID: number): number {
  const emptyIndex: number[] = [];
  sloth.value.writ.forEach((writ: Writ, index: number) => {
    if (!writ.parts.length) emptyIndex.push(index);
  });
  return emptyIndex[emptyID];
}
</script>

<style lang="scss">
.card-actions {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 45px;
  border-top: 1px #eee solid;
}
.card-actions-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.card-actions-item-text {
  font-size: 12px;
  color: #666;
  margin-left: 5px;
}
</style>
