import useDatabase from "@/hooks/useDatabase";
import { settingsTable } from "../schema";

const db = useDatabase();

export const getAllSettingsTableData = async () => {
  try {
    const result = await db.query.settingsTable.findMany();
    return result;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};

export const updateSettingsTableData = async (
  mode: "light" | "dark" | "auto",
  language: "mn" | "en"
) => {
  try {
    const result = await db.update(settingsTable).set({
      mode,
      language,
      updatedBy: "user",
    });
    return result;
  } catch (error) {
    console.error("Error updating record:", error);
  }
};
