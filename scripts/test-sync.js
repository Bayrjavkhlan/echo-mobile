// Test script to verify sync functionality
const { syncAllUnsynced, fullSync } = require("../api/syncService");

async function testSync() {
  console.log("Starting sync test...");
  try {
    // First try a full sync (push local changes and pull server changes)
    console.log("Attempting full sync...");
    const result = await fullSync();
    console.log("Full sync result:", JSON.stringify(result, null, 2));

    if (result.success) {
      console.log("Sync test completed successfully!");
    } else {
      console.error("Sync test failed:", result.message);
    }
  } catch (error) {
    console.error("Error during sync test:", error);
  }
}

testSync();
