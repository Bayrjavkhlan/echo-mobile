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
  userId: number;
  isLoggedIn: boolean;
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
  setUserId: (id: number) => void;
  login: (userId: number) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userId: 1, // Default user ID for non-logged in users
  isLoggedIn: false,
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

  setUserId: (id: number) => set({ userId: id }),

  login: (userId: number) =>
    set({
      userId: userId,
      isLoggedIn: true,
    }),

  logout: () =>
    set({
      userId: 1, // Reset to default user ID
      isLoggedIn: false,
    }),
}));
