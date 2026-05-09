<template>
  <adm-chart :categories="categories" :data="totals" icon="总量"></adm-chart>
  <adm-chart :categories="categories" :data="exchanges" icon="怠惰"></adm-chart>
  <adm-chart :categories="categories" :data="margins" icon="差值"></adm-chart>
</template>

<script setup lang="ts">
import { isSameWeek, getISODay } from "date-fns";
import { sloth } from "@/sdk/db";
import type { Deal } from "@/sdk/db";
import { ref } from "vue";

const today = new Date();
const totals = ref<number[]>(Array(7).fill(0));
const exchanges = ref<number[]>(Array(7).fill(0));
const margins = ref<number[]>(Array(7).fill(0));
const deals: Deal[] = sloth.value.deal.filter((deal: Deal) =>
  isSameWeek(deal.day, today, { weekStartsOn: 1 }),
);

for (const deal of deals) {
  const dayIndex = getISODay(deal.day) - 1;
  totals.value[dayIndex] = deal.total;
  exchanges.value[dayIndex] = deal.exchange;
  margins.value[dayIndex] = deal.total - deal.exchange;
}
const categories = ["壹", "贰", "叁", "肆", "伍", "陆", "柒"];
</script>
