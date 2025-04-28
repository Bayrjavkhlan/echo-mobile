import useDatabase from "@/hooks/useDatabase";
import { labelsTable } from "@/app/db/schema";
import { eq } from "drizzle-orm";

const db = useDatabase();

export const getAllLabelTableData = async () => {
  try {
    const result = await db.query.labelsTable.findMany();
    return result;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};
export const getLabelTableData = async (labelId: number) => {
  try {
    const result = await db.query.labelsTable.findFirst({
      where: eq(labelsTable.id, labelId),
    });
    return result;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};
export const createLabelRecord = async (name: string, color: string) => {
  try {
    const result = await db.insert(labelsTable).values({
      name,
      color,
      count: 1,
      createdAt: Date.now(),
      updatedBy: "user", // todo get the user name or id
    });
    return result;
  } catch (error) {
    console.error("Error creating record:", error);
  }
};
export const updateLabelRecord = async (
  id: number,
  name: string,
  color: string
) => {
  try {
    const result = await db
      .update(labelsTable)
      .set({
        name,
        color,
        updatedBy: "user", // TODO: Replace with actual user info later
      })
      .where(eq(labelsTable.id, id));
    return result;
  } catch (error) {
    console.error("Error updating record:", error);
  }
};
export const deleteLabelRecord = async (id: number) => {
  try {
    const result = await db.delete(labelsTable).where(eq(labelsTable.id, id));
    return result;
  } catch (error) {
    console.error("Error deleting record:", error);
  }
};
