<template>
  <uni-card title="怠惰情况">
    <view style="height: 400rpx">
      <tab-chart :option="option"></tab-chart>
    </view>
  </uni-card>
</template>

<script setup lang="ts">
import { isSameWeek, getISODay } from "date-fns";
import { sloth } from "@/sdk/db";
import type { Deal } from "@/sdk/db";

const today = new Date();
const totals: number[] = Array(7).fill(0);
const exchanges: number[] = Array(7).fill(0);
const margins: number[] = Array(7).fill(0);
const deals: Deal[] = sloth.value.deal.filter((deal: Deal) =>
  isSameWeek(deal.day, today, { weekStartsOn: 1 }),
);

for (const deal of deals) {
  const dayIndex = getISODay(deal.day) - 1;
  totals[dayIndex] = deal.total;
  exchanges[dayIndex] = deal.exchange;
  margins[dayIndex] = deal.total - deal.exchange;
}

const option = {
  xAxis: {
    show: true,
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  },
  yAxis: {
    show: true,
  },
  series: [
    {
      name: "总量",
      data: totals,
      type: "line",
    },
    {
      name: "怠惰量",
      data: exchanges,
      type: "line",
    },
    {
      name: "差值",
      data: margins,
      type: "line",
    },
  ],
};
</script>
