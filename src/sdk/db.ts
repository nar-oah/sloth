import { ref, watch } from "vue";
import { getWeekOfMonth, isAfter, isSameDay, isSameMonth } from "date-fns";
export interface DB {
  deal: Deal[];
  target: Target[];
  writ: Writ[];
}
export interface Deal {
  day: Date;
  total: number;
  exchange: number;
}
export interface Target {
  date: Date;
  month: string;
  weeks: WeekInfo[];
}
export interface WeekInfo {
  weekNum: number;
  info: string;
}
export interface Writ {
  due: Date;
  name: string;
  parts: Part[];
}
export interface Part {
  name: string;
  value: number;
  todos: Todo[];
}
export interface Todo {
  isComplete: boolean;
  context: string;
}

const STORAGE_KEY = "sloth-db";
export let sloth = ref<DB>(init());
export let currentDeal = ref<Deal>(sloth.value.deal.at(-1)!);
export let currentTarget: Target = sloth.value.target.at(-1)!;
export let currentWeek: WeekInfo = currentTarget.weeks.at(-1)!;
watch(
  sloth,
  async (newValue) => {
    await uni.setStorage({ key: STORAGE_KEY, data: newValue });
    console.log("Database saved to storage.");
  },
  { deep: true },
);

function init(): DB {
  const storedData = uni.getStorageSync(STORAGE_KEY) as DB;
  const currentDate: Date = new Date();
  const currentWeekNum: number = getWeekOfMonth(currentDate);
  const initDeal: Deal = { day: currentDate, total: 0, exchange: 0 };
  const initWeek: WeekInfo = { weekNum: currentWeekNum, info: "" };
  const initTarget: Target = {
    date: currentDate,
    month: "",
    weeks: [initWeek],
  };
  if (!storedData) {
    const initDB: DB = {
      deal: [initDeal],
      target: [initTarget],
      writ: [],
    };
    uni.setStorageSync(STORAGE_KEY, initDB);
    return initDB;
  } else {
    const currentDeal: Deal = storedData.deal.at(-1)!;
    const newTotal: number = currentDeal.total - currentDeal.exchange;
    const newDeal: Deal = { day: currentDate, total: newTotal, exchange: 0 };
    if (!isSameDay(currentDate, currentDeal.day)) storedData.deal.push(newDeal);

    const currentTarget: Target = storedData.target.at(-1)!;
    const currentWeek: WeekInfo = currentTarget.weeks.at(-1)!;
    if (!isSameMonth(currentDate, currentTarget.date))
      storedData.target.push(initTarget);
    if (currentWeekNum != currentWeek.weekNum)
      storedData.target.at(-1)!.weeks.push(initWeek);
    return storedData;
  }
}
export function updateTodo(writId: number, partId: number, map: number[]) {
  const currentPart: Part = sloth.value.writ[writId].parts[partId];
  const mapSet = new Set(map);
  currentPart.todos.forEach(
    (todo: Todo, index: number) => (todo.isComplete = mapSet.has(index)),
  );
  const partComplete: boolean = currentPart.todos.every(
    (todo: Todo) => todo.isComplete,
  );
  if (partComplete) currentDeal.value.total += currentPart.value;
}
export function getOverdue(): number[] {
  const currentDate: Date = new Date();
  return sloth.value.writ.reduce((res: number[], writ: Writ, index: number) => {
    if (isAfter(currentDate, writ.due) && !writ.parts.length) res.push(index);
    return res;
  }, []);
}
