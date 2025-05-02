// app/db/crud/testCrud.ts

import useDatabase from "@/hooks/useDatabase";
import { testTable } from "@/db/schema"; // Import testTable explicitly from schema

export const getTestTableData = async () => {
  const db = useDatabase(); // Get access to the db instance

  // Perform a query to get all rows from the test_table
  try {
    const result = await db.query.testTable.findMany(); // Assuming 'testTable' is correctly defined
    console.log(result); // Log the result to see the data

    return result;
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};

export const createTestRecord = async (
  testNumber: number,
  testText: string
) => {
  const db = useDatabase(); // Get access to the db instance

  try {
    const result = await db.insert(testTable).values({
      testNumber,
      testText,
    });
    console.log("Record created:", result);
    return result;
  } catch (error) {
    console.error("Error creating record:", error);
  }
};

// export const updateTestRecord = async (
//   id: number,
//   testNumber: number,
//   testText: string
// ) => {
//   const db = useDatabase(); // Get access to the db instance

//   try {
//     const result = await db
//       .update(testTable)
//       .set({
//         testNumber,
//         testText,
//       })
//       .where(testTable.id.(id)); // Correct way to filter by ID with .eq()

//     console.log("Record updated:", result);
//     return result;
//   } catch (error) {
//     console.error("Error updating record:", error);
//   }
// };
