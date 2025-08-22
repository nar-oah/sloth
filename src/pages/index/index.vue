<template>
  <uni-card
    :title="title"
    :extra="`剩余难度点：${(currentDeal.total - currentDeal.exchange).toFixed(2)}`"
  >
    <view class="exchange">
      <uni-number-box
        :max="currentDeal.total - currentDeal.exchange"
        :value="exchange"
        :step="0.1"
        background="#2979FF"
        color="#fff"
        @change="updateExchange($event)"
      />
      <text>难度点</text>
      <uni-icons type="arrow-right" size="28" color="red"></uni-icons>
      <text>{{ exchange * 100 }}分钟赎罪券</text>
      <uni-icons
        type="checkbox-filled"
        size="32"
        color="#2979FF"
        @click="title = exchange == 0 ? '你在拿我寻开心？' : submitExchange()"
      ></uni-icons>
    </view>
  </uni-card>

  <uni-card class="tags" title="月度计划">
    <uni-easyinput
      :disabled="isMonth"
      v-model="month"
      placeholder="输入灵感以开始..."
      placeholderStyle="font-size:24rpx"
      :suffixIcon="isMonth ? 'compose' : 'checkmarkempty'"
      @iconClick="isMonth ? (isMonth = !isMonth) : submitMonth()"
    ></uni-easyinput>
  </uni-card>

  <uni-card class="tags" title="周度计划">
    <uni-easyinput
      :disabled="isWeek"
      v-model="week"
      placeholder="输入灵感以开始..."
      placeholderStyle="font-size:24rpx"
      :suffixIcon="isWeek ? 'compose' : 'checkmarkempty'"
      @iconClick="isWeek ? (isWeek = month.length == 0) : submitWeek()"
    ></uni-easyinput>
    <view class="tags">
      <uni-tag
        v-show="!isWeek"
        v-for="(tag, tagIndex) in suggest"
        :key="tagIndex"
        :text="tag"
        type="primary"
        :circle="true"
        @click="week = tag"
      ></uni-tag>
    </view>
  </uni-card>

  <uni-segmented-control
    :current="current"
    :values="items"
    @clickItem="handleSwitch"
    styleType="button"
    activeColor="#007aff"
  ></uni-segmented-control>

  <view v-show="current === 0"><tab-wait></tab-wait></view>
  <view v-if="current === 1"><tab-todo></tab-todo></view>
  <view v-if="current === 2"><tab-analyze></tab-analyze></view>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { callSuggest, callWrit } from "@/sdk/call";
import { currentDeal, currentTarget, currentWeek } from "@/sdk/db";

const title = ref("来一笔怠惰的交易？");
const exchange = ref<number>(0.0);
const month = ref<string>(currentTarget.month);
const week = ref<string>(currentWeek.info);
const suggest = ref<string[]>([]);
const isMonth = ref<boolean>(month.value.length != 0);
const isWeek = ref<boolean>(week.value.length != 0 || !isMonth.value);
const items = ref(["未安排", "已安排", "分析"]);
const current = ref(0);

function updateExchange(value: number) {
  title.value = value > exchange.value ? "对，就是这样" : "不，这还不够";
  exchange.value = value;
}
function submitExchange(): string {
  currentDeal.value.exchange += Math.trunc(exchange.value * 100) / 100;
  exchange.value = 0.0;
  return "愉快的交易";
}

async function submitMonth() {
  isMonth.value = true;
  currentTarget.month = month.value;
  suggest.value = await callSuggest();
}
async function submitWeek() {
  isWeek.value = true;
  currentWeek.info = week.value;
  await callWrit();
}

function handleSwitch(e: any) {
  if (current.value != e.currentIndex) {
    current.value = e.currentIndex;
  }
}
</script>

<style lang="scss">
.exchange {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10rpx;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}
</style>
