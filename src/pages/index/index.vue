<template>
  <adm-seal>
    <adm-grop icon="交易">
      <adm-message>{{ title }}</adm-message>
      <adm-message> 剩餘難度點：{{ remaining.toString() }} </adm-message>
      <adm-number-box
        v-if="!time"
        :max="remaining * 60"
        :value="exchange * 60"
        :step="6"
        @change="updateExchange($event)"
      >
        <view>分鐘贖罪券</view>
        <adm-button
          @click="title = exchange == 0 ? '你在拿我尋開心？' : submitExchange()"
          data="确"
        ></adm-button>
      </adm-number-box>
      <adm-countdown v-else :targetTime="date" @finish="handleTimeup()">
        後贖罪券過期
      </adm-countdown>
    </adm-grop>
    <adm-grop icon="计划">
      <adm-input @confirm="submitMonth($event)">
        {{ month || "月度計畫" }}
      </adm-input>
      <adm-input @confirm="submitWeek($event)">
        {{ week || "周度計畫" }}
      </adm-input>
      <adm-message v-for="(tag, index) in suggest" :key="index">
        {{ tag }}
      </adm-message>
    </adm-grop>
    <tab-wait v-if="current === 0"></tab-wait>
    <tab-todo v-if="current === 1"></tab-todo>
    <tab-analyze v-if="current === 2"></tab-analyze>
  </adm-seal>
  <adm-bottom
    style="z-index: 3"
    :current="current"
    @click="handleSwitch($event)"
    :bottom-arr="tabs"
  ></adm-bottom>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { callSuggest, callWrit } from "@/sdk/call";
import { currentDeal, currentTarget, currentWeek } from "@/sdk/db";
import { tabs } from "@/sdk/state";
import { addMinutes } from "date-fns";
import { deleteSeal, sealList } from "@/admUI/adm";

const title = ref("來一筆怠惰的交易？");
const remaining = computed(() =>
  parseFloat(
    (
      currentDeal.value.total -
      currentDeal.value.exchange -
      exchange.value
    ).toFixed(2),
  ),
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
  exchange.value = value / 60;
}
function submitExchange(): string {
  currentDeal.value.exchange += Math.trunc(exchange.value * 100) / 100;
  time.value = exchange.value * 60;
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
    if (sealList.value.length > 2) {
      const id = sealList.value[2].id;
      deleteSeal(id, sealList.value.length - 2);
    }
    current.value = index;
  }
}
</script>
