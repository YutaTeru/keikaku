import { PrescriptionPlan, SavedPlanMeta } from '../types';
import { YAMAGATA_SAMPLE_PLAN, INITIAL_EMPTY_PLAN } from '../data/sampleData';

const CURRENT_PLAN_KEY = 'tg_prescription_current_plan';
const PLAN_LIST_KEY = 'tg_prescription_plan_list_v1';

export function loadCurrentPlan(): PrescriptionPlan {
  try {
    const raw = localStorage.getItem(CURRENT_PLAN_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.student) {
        return parsed as PrescriptionPlan;
      }
    }
  } catch (e) {
    console.error('Failed to load current plan from localStorage', e);
  }
  // Default to Yamagata sample if first time so teacher can immediately see working demo
  return YAMAGATA_SAMPLE_PLAN;
}

export function saveCurrentPlan(plan: PrescriptionPlan): void {
  try {
    const updatedPlan = {
      ...plan,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(CURRENT_PLAN_KEY, JSON.stringify(updatedPlan));

    // Also update in stored list if present
    const list = getSavedPlansList();
    const existingIdx = list.findIndex((p) => p.id === plan.id);
    const meta: SavedPlanMeta = {
      id: plan.id,
      planTitle: plan.planTitle || '無題の計画',
      studentName: plan.student.name || '未設定生徒',
      updatedAt: updatedPlan.updatedAt,
    };

    if (existingIdx >= 0) {
      list[existingIdx] = meta;
    } else {
      list.unshift(meta);
    }
    localStorage.setItem(PLAN_LIST_KEY, JSON.stringify(list));
    localStorage.setItem(`tg_plan_${plan.id}`, JSON.stringify(updatedPlan));
  } catch (e) {
    console.error('Failed to save plan to localStorage', e);
  }
}

export function getSavedPlansList(): SavedPlanMeta[] {
  try {
    const raw = localStorage.getItem(PLAN_LIST_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to get saved plans list', e);
  }
  return [
    {
      id: YAMAGATA_SAMPLE_PLAN.id,
      planTitle: YAMAGATA_SAMPLE_PLAN.planTitle,
      studentName: YAMAGATA_SAMPLE_PLAN.student.name,
      updatedAt: YAMAGATA_SAMPLE_PLAN.updatedAt,
    },
  ];
}

export function loadPlanById(id: string): PrescriptionPlan | null {
  if (id === YAMAGATA_SAMPLE_PLAN.id) {
    return YAMAGATA_SAMPLE_PLAN;
  }
  try {
    const raw = localStorage.getItem(`tg_plan_${id}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(`Failed to load plan ${id}`, e);
  }
  return null;
}

export function createNewPlan(): PrescriptionPlan {
  const newPlan: PrescriptionPlan = {
    ...INITIAL_EMPTY_PLAN,
    id: `plan-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveCurrentPlan(newPlan);
  return newPlan;
}

export function duplicatePlan(plan: PrescriptionPlan): PrescriptionPlan {
  const dup: PrescriptionPlan = {
    ...JSON.parse(JSON.stringify(plan)),
    id: `plan-${Date.now()}`,
    planTitle: `${plan.planTitle} (コピー)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveCurrentPlan(dup);
  return dup;
}

export function deletePlan(id: string): void {
  try {
    localStorage.removeItem(`tg_plan_${id}`);
    const list = getSavedPlansList().filter((p) => p.id !== id);
    localStorage.setItem(PLAN_LIST_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to delete plan', e);
  }
}

export function exportPlanAsJson(plan: PrescriptionPlan): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plan, null, 2));
  const fileName = `処方箋_${plan.student.name || '計画'}_${new Date().toISOString().slice(0, 10)}.json`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', fileName);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
