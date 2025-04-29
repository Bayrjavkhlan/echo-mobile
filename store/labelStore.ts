import { create } from "zustand";
import {
  getAllLabelTableData,
  createLabelTableData,
} from "@/app/db/crud/labels";

export type LabelType = {
  text: string;
  color: string;
};

interface LabelStore {
  labels: LabelType[];
  fetchLabels: () => Promise<void>;
  addLabel: (labelText: string) => Promise<void>;
}

export const useLabelStore = create<LabelStore>((set) => ({
  labels: [],
  fetchLabels: async () => {
    const result = await getAllLabelTableData();
    if (result) {
      set({
        labels: result.map((label: any) => ({
          id: label.id,
          text: label.name,
          color: label.color,
        })),
      });
    }
  },
  addLabel: async (labelText: string) => {
    await createLabelTableData(labelText);
    const result = await getAllLabelTableData();
    if (result) {
      set({
        labels: result.map((label: any) => ({
          id: label.id,
          text: label.name,
          color: label.color,
        })),
      });
    }
  },
}));
