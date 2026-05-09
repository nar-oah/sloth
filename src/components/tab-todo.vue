<template>
  <adm-collapse v-for="(writ, id) in writs" :key="id" :title="writ.name">
    <view v-for="(part, index) in writ.parts" :key="index">
      <adm-message>{{ part.name }}(难度：{{ part.value }})</adm-message>
      <adm-todo-list
        :list="part.todos"
        @change="updateTodo(id, index, $event)"
      ></adm-todo-list>
    </view>
  </adm-collapse>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { sloth, currentDeal } from "@/sdk/db";
import type { Writ, Part, Todo } from "@/sdk/db";

let writs = ref<Writ[]>(
  sloth.value.writ.filter((writ: Writ) => writ.parts.length),
);

function updateTodo(writId: number, partId: number, todos: Todo[]) {
  const currentPart: Part = sloth.value.writ[writId].parts[partId];
  currentPart.todos = todos;
  const partComplete: boolean = currentPart.todos.every(
    (todo: Todo) => todo.isComplete,
  );
  if (partComplete) currentDeal.value.total += currentPart.value;
}
</script>
