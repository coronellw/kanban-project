import { atomWithStorage } from "jotai/utils";

export const themeAtom = atomWithStorage("k-theme", "light")

export const isSidebarVisibleAtom = atomWithStorage("k-sidebar", true)