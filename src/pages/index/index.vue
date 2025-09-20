<template>
  <adm-seal>
    <adm-grop-li>
      <adm-grop icon="交易">
        <text>{{ title }}</text>
        <text> 剩餘難度點：{{ remaining }} </text>
        <adm-number-box
          v-if="!time"
          :max="remaining"
          :value="exchange"
          :step="0.1"
          @change="updateExchange($event)"
        >
          <text>難度點</text>
          <adm-button data="换"></adm-button>
          <text>{{ exchange * 60 }}分鐘贖罪券</text>
          <adm-button
            @click="
              title = exchange == 0 ? '你在拿我寻开心？' : submitExchange()
            "
            data="确"
          ></adm-button>
        </adm-number-box>
        <adm-countdown v-else :targetTime="date" @finish="handleTimeup()">
          後贖罪券過期
        </adm-countdown>
      </adm-grop>
      <adm-grop icon="计划">
        <adm-input @confirm="submitMonth($event.detail.value)">
          月度計畫
        </adm-input>
        <adm-input @confirm="submitWeek($event.detail.value)">
          周度計畫
        </adm-input>
        <text v-if="!isWeek" v-for="(tag, index) in suggest" :key="index">
          {{ tag }}
        </text>
      </adm-grop>
    </adm-grop-li>
    <tab-wait v-show="current === 0"></tab-wait>
    <tab-todo v-if="current === 1"></tab-todo>
    <tab-analyze v-if="current === 2"></tab-analyze>
  </adm-seal>
  <adm-bottom
    style="z-index: 3"
    :current="current"
    @clickItem="handleSwitch($event)"
    :bottom-arr="tabs"
  ></adm-bottom>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { callSuggest, callWrit } from "@/sdk/call";
import { currentDeal, currentTarget, currentWeek } from "@/sdk/db";
import { tabs } from "@/sdk/state";
import { addMinutes } from "date-fns";

const title = ref("來一筆怠惰的交易？");
const remaining = computed(() =>
  (currentDeal.value.total - currentDeal.value.exchange).toFixed(2),
);
const exchange = ref<number>(0.0);
const time = ref<number>(0);
const date = computed((): Date => {
  const current = new Date();
  return addMinutes(current, time.value);
});
const month = ref<string>(currentTarget.month);
const week = ref<string>(currentWeek.info);
const suggest = ref<string[]>([]);
const isMonth = ref<boolean>(month.value.length != 0);
const isWeek = ref<boolean>(week.value.length != 0 || !isMonth.value);
const current = ref(0);

function updateExchange(value: number) {
  title.value = value > exchange.value ? "對，就是這樣" : "不，這還不够";
  exchange.value = value;
  console.log(value, exchange.value);
}
function submitExchange(): string {
  currentDeal.value.exchange += Math.trunc(exchange.value * 100) / 100;
  time.value = exchange.value * 60;
  console.log(time.value, exchange.value);
  exchange.value = 0.0;
  return "愉快的交易";
}
function handleTimeup() {
  uni.showToast({
    title: "贖罪券過期",
  });
  time.value = 0;
  title.value = "來一筆怠惰的交易？";
}

async function submitMonth(value: string) {
  isMonth.value = true;
  currentTarget.month = value;
  suggest.value = await callSuggest();
}
async function submitWeek(value: string) {
  isWeek.value = true;
  tabs.value[0] = "思考";
  currentWeek.info = value;
  await callWrit();
  tabs.value[0] = "安排";
}

function handleSwitch(index: number) {
  if (current.value != index) {
    current.value = index;
  }
}
</script>
