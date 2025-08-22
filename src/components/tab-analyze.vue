<template>
  <uni-card title="怠惰情况">
    <view style="height: 400rpx">
      <tab-chart :option="option"></tab-chart>
    </view>
  </uni-card>
</template>

<script setup lang="ts">
import { isSameWeek } from "date-fns";
import { sloth } from "@/sdk/db";
import type { Deal } from "@/sdk/db";

const today = new Date();
const deals: Deal[] = sloth.value.deal.filter((deal: Deal) =>
  isSameWeek(deal.day, today),
);
const testTotal = [4, 6, 2, 5, 8, 4, 1];
const testExchange = [2, 4, 1, 0, 7, 1, 0];
const testMargin = [2, 2, 1, 5, 1, 3, 1];
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
      data: deals.map((deal: Deal) => deal.total),
      // data: testTotal,
      type: "line",
    },
    {
      name: "怠惰量",
      data: deals.map((deal: Deal) => deal.exchange),
      // data: testExchange,
      type: "line",
    },
    {
      name: "差值",
      data: deals.map((deal: Deal) => deal.total - deal.exchange),
      // data: testMargin,
      type: "line",
    },
  ],
};
</script>

<style lang="scss"></style>
