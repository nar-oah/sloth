import { addDays, startOfDay } from "date-fns";
import { getSuggest, getWrit, getTodo } from "@/sdk/api";
import type { TodoRes } from "@/sdk/api";
import { sloth, currentTarget, currentWeek } from "@/sdk/db";
import type { WeekInfo, Writ, Part } from "@/sdk/db";

const currentDate: Date = new Date();

export async function callSuggest(): Promise<string[]> {
  const weekInfo: string[] = currentTarget.weeks.map(
    (item: WeekInfo) => `第${item.weekNum}周：${item.info}`,
  );
  const targetInfo = `本月目标：${currentTarget.month}\n前几周目标：${weekInfo.toString()}`;
  return await getSuggest(targetInfo);
}

export async function callWrit(): Promise<void> {
  const targetInfo = `本月目标：${currentTarget.month}\n本周核心目标：${currentWeek.info}`;
  const nameList: string[] = await getWrit(targetInfo);
  const currentStart: Date = startOfDay(currentDate);
  const writList: Writ[] = nameList.map((name: string, index: number) => {
    return {
      due: addDays(currentStart, index),
      name: name,
      parts: [],
    };
  });
  sloth.value.writ.push(...writList);
}

export async function callTodo(writID: number): Promise<void> {
  const task: string = sloth.value.writ[writID].name;
  const contents: string = `任务内容：${task}\n目标：${currentWeek.info}`;
  const res: TodoRes[] = await getTodo(contents);
  const parts: Part[] = res.map((item: TodoRes) => ({
    name: item.name,
    value: item.value,
    todos: item.todos.map((context: string) => ({
      isComplete: false,
      context: context,
    })),
  }));
  console.log("before:", task, writID, contents, res, parts, sloth.value.writ);

  sloth.value.writ[writID].parts = parts;
  console.log("after:", sloth.value.writ);
}
