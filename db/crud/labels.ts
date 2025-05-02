import useDatabase from "@/hooks/useDatabase";
import { labelsTable } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

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
export const createLabelTableData = async (name: string) => {
  try {
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(labelsTable);

    const result = await db.insert(labelsTable).values({
      name,
      count: 1,
      createdAt: Date.now(),
      updatedBy: "user", // todo: replace with real user id or name
    });

    return result;
  } catch (error) {
    console.error("Error creating record:", error);
  }
};
export const updateLabelTableData = async (
  id: number,
  name: string,
  color: string
) => {
  try {
    const result = await db
      .update(labelsTable)
      .set({
        name,
        updatedBy: "user", // TODO: Replace with actual user info later
      })
      .where(eq(labelsTable.id, id));
    return result;
  } catch (error) {
    console.error("Error updating record:", error);
  }
};
export const deleteLabelTableData = async (id: number) => {
  try {
    const result = await db.delete(labelsTable).where(eq(labelsTable.id, id));
    return result;
  } catch (error) {
    console.error("Error deleting record:", error);
  }
};

export const deleteAllLabelTableData = async () => {
  try {
    const result = await db.delete(labelsTable);
    return result;
  } catch (error) {
    console.error("Error deleting record:", error);
  }
};
