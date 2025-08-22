<template>
  <uni-collapse>
    <uni-collapse-item v-for="(writ, id) in writs" :key="id" :title="writ.name">
      <uni-section
        v-for="(part, index) in writ.parts"
        :key="index"
        :title="`${part.name}(难度：${part.value})`"
        type="line"
      >
        <uni-data-checkbox
          class="todo"
          multiple
          :value="
            part.todos
              .map((todo, index) => (todo.isComplete == true ? index : -1))
              .filter((i) => i !== -1)
          "
          :localdata="
            part.todos.map((todo, index) => {
              return { value: index, text: todo.context };
            })
          "
          @change="updateTodo(id, index, $event.detail.value)"
        ></uni-data-checkbox>
      </uni-section>
    </uni-collapse-item>
  </uni-collapse>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { sloth, updateTodo } from "@/sdk/db";
import type { Writ } from "@/sdk/db";

const writs = ref<Writ[]>(
  sloth.value.writ.filter((writ: Writ) => writ.parts.length),
);
</script>

<style lang="scss">
.todo {
  margin-left: 20rpx;
}
</style>
