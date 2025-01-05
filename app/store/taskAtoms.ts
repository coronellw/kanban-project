import { atom } from "jotai";
import type { ITask } from "~/types";

export const selectedTaskAtom = atom<ITask>()

export const subTasksAtom = atom(get => {
  const task = get(selectedTaskAtom)
  return task?.subtasks
})