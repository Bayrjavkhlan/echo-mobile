import {
  getUserTableData,
  createUserTableData,
  updateUserTableData,
} from "@/db/crud/user";
import { create } from "zustand";

interface userType {
  id: number;
  name: string;
  email: string | null;
  age: number | null;
  createdAt: Date;
  updatedBy: string | null;
}

interface UserStore {
  user: userType | null;
  fetchUser: () => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;
  createUser: (
    name: string,
    email: string,
    password: string,
    age: number
  ) => Promise<void>;
  updateUser: (
    id: number,
    name: string,
    email: string,
    password: string,
    age: number
  ) => Promise<void>;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,

  fetchUser: async () => {
    const user = await getUserTableData(1);
    if (user) {
      set({
        user: {
          id: user.id,
          name: user.username,
          email: user.email,
          age: user.age,
          createdAt: new Date(user.createdAt),
          updatedBy: user.updatedBy,
        },
      });
    }
  },

  fetchUserById: async (id: number) => {
    const user = await getUserTableData(id);
    if (user) {
      set({
        user: {
          id: user.id,
          name: user.username,
          email: user.email,
          age: user.age,
          createdAt: new Date(user.createdAt),
          updatedBy: user.updatedBy,
        },
      });
    }
  },

  createUser: async (name, email, password, age) => {
    const inserted = await createUserTableData(name, email, password, age);
    if (inserted) {
      const user = await getUserTableData(inserted[0].id);
      if (user) {
        set({
          user: {
            id: user.id,
            name: user.username,
            email: user.email,
            age: user.age,
            createdAt: new Date(user.createdAt),
            updatedBy: user.updatedBy,
          },
        });
      }
    }
  },

  updateUser: async (id, name, email, password, age) => {
    await updateUserTableData(id, name, email, password, age);
    const user = await getUserTableData(id);
    if (user) {
      set({
        user: {
          id: user.id,
          name: user.username,
          email: user.email,
          age: user.age,
          createdAt: new Date(user.createdAt),
          updatedBy: user.updatedBy,
        },
      });
    }
  },
}));
