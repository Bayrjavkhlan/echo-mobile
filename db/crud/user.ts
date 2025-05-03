import useDatabase from "@/hooks/useDatabase";
import { userTable } from "../schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

const db = useDatabase();

export const getAllUserTableData = async () => {
  try {
    const result = await db.query.userTable.findMany();
    return result;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};

export const getUserTableData = async (userId: number) => {
  try {
    const result = await db.query.userTable.findFirst({
      where: eq(userTable.id, userId),
    });
    return result;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};

export const createUserTableData = async (
  name: string,
  email: string,
  password: string,
  age: number
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await db
      .insert(userTable)
      .values({
        username: name,
        email,
        password: hashedPassword,
        age,
        createdAt: Date.now(),
        updatedBy: name,
      })
      .returning({ id: userTable.id });
    return result;
  } catch (error) {
    console.error("Error creating record:", error);
  }
};
export const updateUserTableData = async (
  id: number,
  name: string,
  email: string,
  password: string,
  age: number
) => {
  try {
    const result = await db
      .update(userTable)
      .set({
        username: name,
        email,
        password,
        age,
        updatedBy: name,
      })
      .where(eq(userTable.id, id));
    return result;
  } catch (error) {
    console.error("Error updating record:", error);
  }
};
export const deleteUserTableData = async (id: number) => {
  try {
    const result = await db.delete(userTable).where(eq(userTable.id, id));
    return result;
  } catch (error) {
    console.error("Error deleting record:", error);
  }
};
