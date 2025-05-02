import useDatabase from "@/hooks/useDatabase";
import { groupsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const db = useDatabase();

export const getAllGroupTableData = async () => {
  try {
    const result = await db.query.groupsTable.findMany();
    console.log("getAllGroupTableData:", result);
    return result;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};
export const getGroupTableData = async (groupId: number) => {
  try {
    const result = await db.query.groupsTable.findFirst({
      where: eq(groupsTable.id, groupId),
    });

    return result;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};
export const createGroupRecord = async (
  groupName: string,
  description: string
) => {
  try {
    const result = await db.insert(groupsTable).values({
      name: groupName,
      description,
      createdAt: Date.now(),
      updatedBy: "user", // todo get the user name or id
    });
    return result;
  } catch (error) {
    console.error("Error creating record:", error);
  }
};
export const updateGroupRecord = async (
  id: number,
  groupName: string,
  description: string
) => {
  try {
    const result = await db
      .update(groupsTable)
      .set({
        name: groupName,
        description,
        updatedBy: "user", // TODO: Replace with actual user info later
      })
      .where(eq(groupsTable.id, id));
    return result;
  } catch (error) {
    console.error("Error updating record:", error);
  }
};
export const deleteGroupRecord = async (id: number) => {
  try {
    const result = await db.delete(groupsTable).where(eq(groupsTable.id, id));
    return result;
  } catch (error) {
    console.error("Error deleting record:", error);
  }
};
export const deleteAllGroupRecords = async () => {
  try {
    const result = await db.delete(groupsTable);
    return result;
  } catch (error) {
    console.error("Error deleting all records:", error);
  }
};
// use this to get the all of needed data jawhaa
export const getGroupWithFlashcardsAndLabels = async (groupId: number) => {
  try {
    const group = await db.query.groupsTable.findFirst({
      where: eq(groupsTable.id, groupId),
      with: {
        flashcards: {
          with: {
            labels: {
              columns: {},
              with: {
                label: true,
              },
            },
          },
        },
      },
    });

    return group;
  } catch (error) {
    console.error("Error retrieving group with flashcards:", error);
  }
};
