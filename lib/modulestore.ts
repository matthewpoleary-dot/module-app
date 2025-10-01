// lib/modulesStore.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

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

export const useModulesStore = create<ModulesState>()(
  persist(
    (set, get) => ({
      modules: [],
      addModule: (m) =>
        set({
          modules: [
            ...get().modules,
            {
              ...m,
              id: Math.random().toString(36).slice(2),
              createdAt: Date.now(),
            },
          ],
        }),
      removeModule: (id) =>
        set({ modules: get().modules.filter((x) => x.id !== id) }),
      clear: () => set({ modules: [] }),
    }),
    {
      name: "modules-store-v1",
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      migrate: (state) => state, // simple
    }
  )
);
