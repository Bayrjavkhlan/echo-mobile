import * as SQLite from "expo-sqlite";
import { Platform } from "react-native";
import {
  Flashcard,
  CreateFlashcardDPO,
  UpdateFlashcardDPO,
} from "./flashcardService";

// Define SQLite transaction and database interfaces
interface SQLiteTransaction {
  executeSql: (
    sqlStatement: string,
    args?: any[],
    success?: (transaction: SQLiteTransaction, resultSet: any) => void,
    error?: (transaction: SQLiteTransaction, error: Error) => boolean
  ) => void;
}

interface SQLiteDatabase {
  transaction: (callback: (tx: SQLiteTransaction) => void) => void;
}

// Helper function to open the database
function openDatabase(): SQLiteDatabase {
  if (Platform.OS === "web") {
    // SQLite is not supported on web
    return {
      transaction: () => {
        // Empty implementation for web
      },
    };
  }

  // Cast to our defined interface type to ensure transaction method is recognized
  return SQLite.openDatabaseSync(
    "echo_flashcards.db"
  ) as unknown as SQLiteDatabase;
}

// Database connection
const db = openDatabase();

export const initDatabase = () => {
  return new Promise<void>((resolve, reject) => {
    db.transaction((tx: SQLiteTransaction) => {
      // Create flashcards table
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS flashcards (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          remote_id INTEGER,
          group_id INTEGER,
          question_type TEXT,
          question TEXT,
          answer TEXT,
          label TEXT,
          description TEXT,
          is_synced INTEGER DEFAULT 0
        )`,
        [],
        () => {
          // Create groups table
          tx.executeSql(
            `CREATE TABLE IF NOT EXISTS groups (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              remote_id INTEGER,
              name TEXT,
              description TEXT,
              is_synced INTEGER DEFAULT 0
            )`,
            [],
            () => {
              resolve();
            },
            (_: SQLiteTransaction, error: Error) => {
              reject(error);
              return false;
            }
          );
        },
        (_: SQLiteTransaction, error: Error) => {
          reject(error);
          return false;
        }
      );
    });
  });
};

// Flashcards operations
export const databaseApi = {
  // Get all flashcards
  getAllFlashcards: (): Promise<Flashcard[]> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx: SQLiteTransaction) => {
        tx.executeSql(
          "SELECT * FROM flashcards",
          [],
          (
            _: SQLiteTransaction,
            { rows }: { rows: { length: number; item: (idx: number) => any } }
          ) => {
            const flashcards: Flashcard[] = [];
            for (let i = 0; i < rows.length; i++) {
              const item = rows.item(i);
              flashcards.push({
                id: item.remote_id || item.id,
                group_id: item.group_id,
                question_type: item.question_type,
                answer: item.answer,
                label: item.label,
                description: item.description,
              });
            }
            resolve(flashcards);
          },
          (_: SQLiteTransaction, error: Error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  // Get flashcard by ID
  getFlashcardById: (id: number): Promise<Flashcard | null> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx: SQLiteTransaction) => {
        tx.executeSql(
          "SELECT * FROM flashcards WHERE id = ? OR remote_id = ?",
          [id, id],
          (
            _: SQLiteTransaction,
            { rows }: { rows: { length: number; item: (idx: number) => any } }
          ) => {
            if (rows.length > 0) {
              const item = rows.item(0);
              resolve({
                id: item.remote_id || item.id,
                group_id: item.group_id,
                question_type: item.question_type,
                answer: item.answer,
                label: item.label,
                description: item.description,
              });
            } else {
              resolve(null);
            }
          },
          (_: SQLiteTransaction, error: Error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  // Get flashcards by group ID
  getGroupFlashcards: (group_id: number): Promise<Flashcard[]> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx: SQLiteTransaction) => {
        tx.executeSql(
          "SELECT * FROM flashcards WHERE group_id = ?",
          [group_id],
          (
            _: SQLiteTransaction,
            { rows }: { rows: { length: number; item: (idx: number) => any } }
          ) => {
            const flashcards: Flashcard[] = [];
            for (let i = 0; i < rows.length; i++) {
              const item = rows.item(i);
              flashcards.push({
                id: item.remote_id || item.id,
                group_id: item.group_id,
                question_type: item.question_type,
                answer: item.answer,
                label: item.label,
                description: item.description,
              });
            }
            resolve(flashcards);
          },
          (_: SQLiteTransaction, error: Error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  // Create a flashcard
  createFlashcard: (
    flashcard: CreateFlashcardDPO,
    remote_id?: number
  ): Promise<Flashcard> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx: SQLiteTransaction) => {
        tx.executeSql(
          `INSERT INTO flashcards (remote_id, group_id, question_type, question, answer, label, description, is_synced) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            remote_id || null,
            flashcard.group_id,
            flashcard.question_type,
            flashcard.question,
            flashcard.answer,
            flashcard.label,
            flashcard.description,
            remote_id ? 1 : 0,
          ],
          (_: SQLiteTransaction, { insertId }: { insertId: number }) => {
            resolve({
              id: remote_id || insertId,
              group_id: flashcard.group_id,
              question_type: flashcard.question_type,
              answer: flashcard.answer,
              label: flashcard.label,
              description: flashcard.description,
            });
          },
          (_: SQLiteTransaction, error: Error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  // Update a flashcard
  updateFlashcard: (
    id: number,
    flashcard: UpdateFlashcardDPO
  ): Promise<Flashcard> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx: SQLiteTransaction) => {
        tx.executeSql(
          `UPDATE flashcards SET 
           question_type = ?, 
           question = ?, 
           answer = ?, 
           label = ?, 
           description = ?,
           is_synced = 0
           WHERE id = ? OR remote_id = ?`,
          [
            flashcard.question_type,
            flashcard.question,
            flashcard.answer,
            flashcard.label,
            flashcard.description,
            id,
            id,
          ],
          (
            _: SQLiteTransaction,
            { rowsAffected }: { rowsAffected: number }
          ) => {
            if (rowsAffected > 0) {
              resolve({
                id: id,
                group_id: -1, // We don't have this information at this point
                question_type: flashcard.question_type,
                answer: flashcard.answer,
                label: flashcard.label,
                description: flashcard.description,
              });
            } else {
              reject(new Error("Flashcard not found"));
            }
          },
          (_: SQLiteTransaction, error: Error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  // Delete a flashcard
  deleteFlashcard: (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx: SQLiteTransaction) => {
        tx.executeSql(
          "DELETE FROM flashcards WHERE id = ? OR remote_id = ?",
          [id, id],
          (_: SQLiteTransaction) => {
            resolve();
          },
          (_: SQLiteTransaction, error: Error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  // Get unsynced flashcards (to sync with server when online)
  getUnsyncedFlashcards: (): Promise<{ id: number; data: any }[]> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx: SQLiteTransaction) => {
        tx.executeSql(
          "SELECT * FROM flashcards WHERE is_synced = 0",
          [],
          (
            _: SQLiteTransaction,
            { rows }: { rows: { length: number; item: (idx: number) => any } }
          ) => {
            const unsyncedFlashcards = [];
            for (let i = 0; i < rows.length; i++) {
              const item = rows.item(i);
              unsyncedFlashcards.push({
                id: item.id,
                data: {
                  remote_id: item.remote_id,
                  group_id: item.group_id,
                  question_type: item.question_type,
                  question: item.question,
                  answer: item.answer,
                  label: item.label,
                  description: item.description,
                },
              });
            }
            resolve(unsyncedFlashcards);
          },
          (_: SQLiteTransaction, error: Error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },

  // Mark flashcard as synced
  markFlashcardAsSynced: (
    local_id: number,
    remote_id: number
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      db.transaction((tx: SQLiteTransaction) => {
        tx.executeSql(
          "UPDATE flashcards SET remote_id = ?, is_synced = 1 WHERE id = ?",
          [remote_id, local_id],
          (_: SQLiteTransaction) => {
            resolve();
          },
          (_: SQLiteTransaction, error: Error) => {
            reject(error);
            return false;
          }
        );
      });
    });
  },
};
