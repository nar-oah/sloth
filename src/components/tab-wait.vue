<template>
  <adm-grop
    v-for="(item, index) in filterWrits"
    :key="item.name"
    :icon="getIcon(item.due)"
    :column="['提前', '廢除']"
    @click="handleColumn($event, index)"
  >
    <adm-input @confirm="submitWait(index, $event.detail.value)">
      {{ item.name }}
    </adm-input>
  </adm-grop>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { differenceInDays } from "date-fns";
import { sloth } from "@/sdk/db";
import type { Writ } from "@/sdk/db";
import { callTodo } from "@/sdk/call";
import { sealList, deleteSeal } from "@/admUI/adm";

const currentDate = new Date();
const writs = ref<Writ[]>(sloth.value.writ);
const filterWrits = computed(() =>
  sloth.value.writ.filter((writ: Writ) => !writ.parts.length),
);

function handleColumn(id: number, index: number) {
  console.log(getID(index));

  const handleId = sealList.value[index + 2].id;
  deleteSeal(handleId, 1);
  // gropSeal.value.splice(index + 2, 1);
  id ? sloth.value.writ.splice(getID(index), 1) : callTodo(getID(index));
}
function submitWait(changeID: number, value: string) {
  const id = getID(changeID);
  writs.value[id].name = value;
}
function getID(emptyID: number): number {
  const emptyIndex: number[] = [];
  sloth.value.writ.forEach((writ: Writ, index: number) => {
    if (!writ.parts.length) emptyIndex.push(index);
  });
  return emptyIndex[emptyID];
}
function getIcon(due: Date): string {
  const day = differenceInDays(due, currentDate) + 1;
  const iconList = ["前", "昨", "今", "明", "后", "叁", "肆", "伍", "陆", "柒"];
  return iconList[day + 2] + "天";
}
</script>
