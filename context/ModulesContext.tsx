// context/ModulesContext.tsx
import React, { createContext, useContext, useMemo, useState } from "react";

type Weightings = { exam: number; project: number; assessments: number; attendance: number };

export type Module = {
  id: string;
  name: string;
  credits: number;           // ECTS
  grade: number | null;
  semester: string | null;
  weightings: Weightings;    // stored per module
};

export type Meeting = {
  id: string;
  moduleId: string;
  kind: string;              // "Lecture" | "Tutorial" | ...
  day: number;               // 0..6 (Sun..Sat)
  start: string;             // "09:00"
  end: string;               // "10:00"
  location: string | null;
};

export type DeadlineStatus = "todo" | "in_progress" | "done";
export type Deadline = {
  id: string;
  moduleId: string;
  title: string;
  dueISO: string;            // ISO datetime
  details: string | null;
  status: DeadlineStatus;
};

type Totals = { ects: number; weightedAvg: number | null };

type Ctx = {
  modules: Module[];
  meetings: Meeting[];
  deadlines: Deadline[];
  totals: Totals;

  semesterStartISO: string;
  setSemesterStartISO: (iso: string) => void;

  defaultWeighting: Weightings;

  // modules
  addModule: (m: { name: string; credits: number; semester: string | null; weightings: Weightings }) => string;
  upsert: (m: Partial<Module> & { id: string }) => void;
  remove: (id: string) => void;
  getWeightings: (id: string) => Weightings | undefined;
  replaceModuleWeightings: (id: string, w: Weightings) => void;

  // meetings
  addMeeting: (m: Omit<Meeting, "id">) => string;
  removeMeeting: (id: string) => void;

  // deadlines
  addDeadline: (d: Omit<Deadline, "id" | "status">) => string;
  removeDeadline: (id: string) => void;
  setDeadlineStatus: (id: string, s: DeadlineStatus) => void;
};

const ModulesContext = createContext<Ctx | null>(null);

// small, dependency-free id
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export function ModulesProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [semesterStartISO, setSemesterStartISO] = useState<string>(new Date().toISOString());

  const defaultWeighting: Weightings = { exam: 70, project: 30, assessments: 0, attendance: 0 };

  // modules
  const addModule: Ctx["addModule"] = ({ name, credits, semester, weightings }) => {
    const id = uid();
    setModules((arr) => [...arr, { id, name, credits, grade: null, semester, weightings: { ...weightings } }]);
    return id;
  };

  const upsert: Ctx["upsert"] = (m) => {
    setModules((arr) => {
      const i = arr.findIndex((x) => x.id === m.id);
      if (i === -1) return arr;
      const curr = arr[i];
      const next: Module = {
        ...curr,
        ...m,
        weightings: { ...curr.weightings, ...(m as any).weightings },
      };
      const copy = [...arr];
      copy[i] = next;
      return copy;
    });
  };

  const remove: Ctx["remove"] = (id) => {
    setModules((arr) => arr.filter((m) => m.id !== id));
    setMeetings((arr) => arr.filter((m) => m.moduleId !== id));
    setDeadlines((arr) => arr.filter((d) => d.moduleId !== id));
  };

  const getWeightings: Ctx["getWeightings"] = (id) => modules.find((m) => m.id === id)?.weightings;

  const replaceModuleWeightings: Ctx["replaceModuleWeightings"] = (id, w) => {
    setModules((arr) => arr.map((m) => (m.id === id ? { ...m, weightings: { ...w } } : m)));
  };

  // meetings
  const addMeeting: Ctx["addMeeting"] = (m) => {
    const id = uid();
    setMeetings((arr) => [...arr, { id, ...m }]);
    return id;
  };
  const removeMeeting: Ctx["removeMeeting"] = (id) => {
    setMeetings((arr) => arr.filter((m) => m.id !== id));
  };

  // deadlines
  const addDeadline: Ctx["addDeadline"] = (d) => {
    const id = uid();
    setDeadlines((arr) => [...arr, { id, status: "todo", ...d }]);
    return id;
  };
  const removeDeadline: Ctx["removeDeadline"] = (id) => {
    setDeadlines((arr) => arr.filter((d) => d.id !== id));
  };
  const setDeadlineStatus: Ctx["setDeadlineStatus"] = (id, s) => {
    setDeadlines((arr) => arr.map((d) => (d.id === id ? { ...d, status: s } : d)));
  };

  const totals = useMemo<Totals>(() => {
    const ects = modules.reduce((s, m) => s + (m.credits || 0), 0);
    const graded = modules.filter((m) => typeof m.grade === "number" && m.grade !== null);
    const weightedAvg =
      graded.length === 0
        ? null
        : graded.reduce((s, m) => s + m.grade! * (m.credits || 0), 0) /
          graded.reduce((s, m) => s + (m.credits || 0), 0);
    return { ects, weightedAvg };
  }, [modules]);

  const value: Ctx = {
    modules,
    meetings,
    deadlines,
    totals,
    semesterStartISO,
    setSemesterStartISO,
    defaultWeighting,
    addModule,
    upsert,
    remove,
    getWeightings,
    replaceModuleWeightings,
    addMeeting,
    removeMeeting,
    addDeadline,
    removeDeadline,
    setDeadlineStatus,
  };

  return <ModulesContext.Provider value={value}>{children}</ModulesContext.Provider>;
}

export function useModules() {
  const ctx = useContext(ModulesContext);
  if (!ctx) throw new Error("useModules must be used within ModulesProvider");
  return ctx;
}
