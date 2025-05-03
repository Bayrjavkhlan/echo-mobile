import { create } from "zustand";
import { getAllLabelTableData, createLabelTableData } from "@/db/crud/labels";

export type LabelType = {
  id: number | string;
  text?: string;
  name?: string;
  color?: string;
};

interface LabelStore {
  labels: LabelType[];
  fetchLabels: () => Promise<void>;
  addLabel: (labelText: string) => Promise<void>;
}

export const useLabelStore = create<LabelStore>((set) => ({
  labels: [],
  fetchLabels: async () => {
    try {
      const result = await getAllLabelTableData();
      if (result) {
        set({
          labels: result.map((label: any) => ({
            id: label.id,
            text: label.name,
            name: label.name,
            color: label.color,
          })),
        });
        console.log("Labels fetched successfully:", result.length);
      }
    } catch (error) {
      console.error("Error fetching labels:", error);
    }
  },
  addLabel: async (labelText: string) => {
    try {
      console.log("Adding new label:", labelText);
      const result = await createLabelTableData(labelText);
      console.log("Label created result:", result);

      const updatedLabels = await getAllLabelTableData();
      if (updatedLabels) {
        set({
          labels: updatedLabels.map((label: any) => ({
            id: label.id,
            text: label.name,
            name: label.name,
            color: label.color,
          })),
        });
        console.log(
          "Labels updated after adding new label. Count:",
          updatedLabels.length
        );
      }
    } catch (error) {
      console.error("Error adding label:", error);
    }
  },
}));
