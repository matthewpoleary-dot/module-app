// context/ModulesContext.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Alert } from 'react-native';

export type Mod = { id: string; name: string; credits: number; grade?: number | null; semester?: string | null; };

export type Weighting = { project: number; assessment: number; attendance: number; exam: number; };

export type Meeting = {
  id: string; moduleId: string;
  kind: 'Lecture' | 'Tutorial' | 'Lab' | 'Seminar' | 'Other';
  day: 0|1|2|3|4|5|6; start: string; end: string; location?: string | null;
};

export type DeadlineStatus = 'todo' | 'in_progress' | 'done';

export type Deadline = {
  id: string; moduleId: string; title: string; dueISO: string; details?: string | null; status: DeadlineStatus;
};

type Ctx = {
  isHydrated: boolean;
  modules: Mod[]; upsert: (m: Omit<Mod,'id'> & {id?:string}) => void; remove: (id:string)=>void; clearAll:()=>void;
  defaultWeighting: Weighting; setDefaultWeighting:(w:Weighting)=>void;
  semesterStartISO: string; setSemesterStartISO:(iso:string)=>void;
  meetings: Meeting[]; addMeeting:(m:Omit<Meeting,'id'>)=>void; removeMeeting:(id:string)=>void;
  deadlines: Deadline[]; addDeadline:(d:Omit<Deadline,'id'|'status'>)=>void; removeDeadline:(id:string)=>void; setDeadlineStatus:(id:string,status:DeadlineStatus)=>void;
  totals:{ects:number; withGrade:number; weightedAvg:number|null};
};

const KEY = 'module-tracker:v4';
const ModulesContext = createContext<Ctx|null>(null);

const DEFAULT_WEIGHTING: Weighting = { project:0, assessment:0, attendance:0, exam:100 };
const defaultSemesterStart = (() => { const d=new Date(); const diff=(d.getDay()+6)%7; d.setDate(d.getDate()-diff); d.setHours(0,0,0,0); return d.toISOString(); })();

export function ModulesProvider({children}:{children:React.ReactNode}) {
  const [isHydrated,setIsHydrated]=useState(false);
  const [modules,setModules]=useState<Mod[]>([]);
  const [defaultWeighting,setDefaultWeighting]=useState<Weighting>(DEFAULT_WEIGHTING);
  const [semesterStartISO,setSemesterStartISO]=useState(defaultSemesterStart);
  const [meetings,setMeetings]=useState<Meeting[]>([]);
  const [deadlines,setDeadlines]=useState<Deadline[]>([]);

  useEffect(()=>{(async()=>{try{
    const raw=await AsyncStorage.getItem(KEY);
    if(raw){ const p=JSON.parse(raw);
      if(Array.isArray(p.modules)) setModules(p.modules);
      if(p.defaultWeighting) setDefaultWeighting(p.defaultWeighting);
      if(p.semesterStartISO) setSemesterStartISO(p.semesterStartISO);
      if(Array.isArray(p.meetings)) setMeetings(p.meetings);
      if(Array.isArray(p.deadlines)) setDeadlines(p.deadlines);
    }}catch{Alert.alert('Error','Could not load saved data.')}
    finally{setIsHydrated(true);}})();},[]);

  useEffect(()=>{ if(!isHydrated) return;
    AsyncStorage.setItem(KEY, JSON.stringify({modules,defaultWeighting,semesterStartISO,meetings,deadlines})).catch(()=>{});
  },[isHydrated,modules,defaultWeighting,semesterStartISO,meetings,deadlines]);

  const upsert:Ctx['upsert']=(m)=>{ setModules(prev=> m.id? prev.map(x=>x.id===m.id?{...x,...m}:x)
      : [...prev,{ id:Math.random().toString(36).slice(2), name:m.name.trim(), credits:m.credits, grade:m.grade ?? null, semester:m.semester ?? null }]); };
  const remove:Ctx['remove']=(id)=>{ setModules(p=>p.filter(x=>x.id!==id)); setMeetings(p=>p.filter(x=>x.moduleId!==id)); setDeadlines(p=>p.filter(x=>x.moduleId!==id)); };
  const clearAll=()=>{ setModules([]); setMeetings([]); setDeadlines([]); };

  const addMeeting:Ctx['addMeeting']=(m)=> setMeetings(p=>[...p,{id:Math.random().toString(36).slice(2),...m}]);
  const removeMeeting:Ctx['removeMeeting']=(id)=> setMeetings(p=>p.filter(x=>x.id!==id));

  const addDeadline:Ctx['addDeadline']=(d)=> setDeadlines(p=>[...p,{id:Math.random().toString(36).slice(2), status:'todo', ...d}]);
  const removeDeadline:Ctx['removeDeadline']=(id)=> setDeadlines(p=>p.filter(x=>x.id!==id));
  const setDeadlineStatus:Ctx['setDeadlineStatus']=(id,status)=> setDeadlines(p=>p.map(x=>x.id===id?{...x,status}:x));

  const totals = useMemo(()=> {
    const ects=modules.reduce((s,m)=>s+(Number(m.credits)||0),0);
    const graded=modules.filter(m=>m.grade!=null && !Number.isNaN(m.grade as number) && m.credits>0);
    const withGrade=graded.reduce((s,m)=>s+m.credits,0);
    const weightedAvg=graded.length? graded.reduce((s,m)=>s+(Number(m.grade)||0)*m.credits,0)/withGrade : null;
    return { ects, withGrade, weightedAvg };
  },[modules]);

  return (
    <ModulesContext.Provider value={{isHydrated,modules,upsert,remove,clearAll,defaultWeighting,setDefaultWeighting,semesterStartISO,setSemesterStartISO,meetings,addMeeting,removeMeeting,deadlines,addDeadline,removeDeadline,setDeadlineStatus,totals}}>
      {children}
    </ModulesContext.Provider>
  );
}
export function useModules(){ const ctx=useContext(ModulesContext); if(!ctx) throw new Error('useModules must be used within ModulesProvider'); return ctx; }
