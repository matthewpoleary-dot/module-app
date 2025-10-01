// lib/modulestore.ts
import { create } from "zustand";

export type Weightings = {
  exam: number;
  project: number;
  assessments: number;
  attendance: number;
};

export type ModuleItem = {
  id: string;
  name: string;
  code?: string;
  ects: number;
  weightings: Weightings;
  createdAt: number;
};

type ModulesState = {
  modules: ModuleItem[];
  addModule: (m: Omit<ModuleItem, "id" | "createdAt">) => void;
  removeModule: (id: string) => void;
  clear: () => void;
};

export const useModulesStore = create<ModulesState>((set, get) => ({
  modules: [],
  addModule: (m) =>
    set({
      modules: [
        ...get().modules,
        { ...m, id: Math.random().toString(36).slice(2), createdAt: Date.now() },
      ],
    }),
  removeModule: (id) => set({ modules: get().modules.filter((x) => x.id !== id) }),
  clear: () => set({ modules: [] }),
}));
