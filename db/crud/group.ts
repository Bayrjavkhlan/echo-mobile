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
    console.log("Error retrieving data:", error);
  }
};
export const getGroupTableData = async (groupId: number) => {
  try {
    const result = await db.query.groupsTable.findFirst({
      where: eq(groupsTable.id, groupId),
    });

    return result;
  } catch (error) {
    console.log("Error retrieving data:", error);
  }
};
export const createGroupRecord = async (
  groupName: string,
  description: string,
  userId: number = 0 // Default userId is 0 until user creates an account
) => {
  try {
    const result = await db.insert(groupsTable).values({
      name: groupName,
      description,
      userId, // Added userId field
      createdAt: Date.now(),
      updatedBy: "user", // todo get the user name or id
    });
    return result;
  } catch (error) {
    console.log("Error creating record:", error);
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
    console.log("Error updating record:", error);
  }
};
export const deleteGroupRecord = async (id: number) => {
  try {
    const result = await db.delete(groupsTable).where(eq(groupsTable.id, id));
    return result;
  } catch (error) {
    console.log("Error deleting record:", error);
  }
};
export const deleteAllGroupRecords = async () => {
  try {
    const result = await db.delete(groupsTable);
    return result;
  } catch (error) {
    console.log("Error deleting all records:", error);
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
    console.log("Error retrieving group with flashcards:", error);
  }
};
