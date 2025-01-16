import { create } from 'zustand';
import { Classroom } from '@/types/classroom';
import {getMaterialByClassroom, getEvaluationsByIds} from '@/lib/firebaseUtils';

import { Material } from '@/types/material';
import { Student } from '@/types/student';
import { Evaluation } from '@/types/evaluation';

interface ClassroomState {
  classroom: Classroom | null;
  material: Material | null;
  students: Student[];
  weeklyTests: Evaluation[];
  homeworks: Evaluation[];
  reinforcements: Evaluation[];
  setClassroom: (classroom: Classroom) => void;
  setMaterial: (material: Material) => void;
  setStudents: (students: Student[]) => void;
  setWeeklyTests: (weeklyTests: Evaluation[]) => void;
  setHomeworks: (homeworks: Evaluation[]) => void;
  setReinforcements: (reinforcements: Evaluation[]) => void;
  fetchMaterial: (classroom: Classroom) => Promise<void>;
  fetchWeeklyTests: (weeklyTestIds: string[]) => Promise<void>;
  fetchHomeworks: (homeworkIds: string[]) => Promise<void>;
  fetchReinforcements: (reinforcementIds: string[]) => Promise<void>;
}

export const useClassroomStore = create<ClassroomState>((set) => ({
  classroom: null,
  material: null,
  students: [],
  weeklyTests: [],
  homeworks: [],
  reinforcements: [],

  // Actualiza la info del Classroom
  setClassroom: (classroom) => set({ classroom }),

  // Actualiza la info del Material
  setMaterial: (material) => set({ material }),

  // Estudiantes cargados
  setStudents: (students) => set({ students }),

  // Pruebas semanales cargadas
  setWeeklyTests: (weeklyTests) => set({ weeklyTests }),

  // Tareas cargadas
  setHomeworks: (homeworks) => set({ homeworks }),

  // Refuerzos cargados
  setReinforcements: (reinforcements) => set({ reinforcements }),

  // Fetch para obtener Material basado en Classroom
  fetchMaterial: async (classroom) => {
    const { courseId, grade, schoolId } = classroom;
    const material = await getMaterialByClassroom({ courseId, grade, schoolId });
    set({ material });
  },

  // Fetch para obtener WeeklyTests
  fetchWeeklyTests: async (weeklyTestIds) => {
    const weeklyTests = await getEvaluationsByIds(weeklyTestIds);
    set({ weeklyTests });
  },

  // Fetch para obtener Homeworks
  fetchHomeworks: async (homeworkIds) => {
    const homeworks = await getEvaluationsByIds(homeworkIds);
    set({ homeworks });
  },

  // Fetch para obtener Refuerzos
  fetchReinforcements: async (reinforcementIds) => {
    const reinforcements = await getEvaluationsByIds(reinforcementIds);
    set({ reinforcements });
  }
}));
