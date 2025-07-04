import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";

// Define the shape of the user object
interface User {
  id: string;
  username: string;
  email: string;
}

// Define the shape of the auth context
interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  login: (token: string, userData: User) => Promise<void>;
  logout: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

// Provider component to wrap the app
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  // Check authentication status on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userId = await AsyncStorage.getItem("userId");
        const username = await AsyncStorage.getItem("username");
        const email = await AsyncStorage.getItem("userEmail");

        if (userId && username) {
          setUser({
            id: userId,
            username,
            email: email || "",
          });
        }
      } catch (error) {
        console.log("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Monitor the authentication state and redirect if necessary
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // If not logged in and not on an auth screen, redirect to login
      router.replace("/login");
    } else if (user && inAuthGroup) {
      // If logged in and on an auth screen, redirect to home
      router.replace("/");
    }
  }, [user, segments, isLoading]);

  // Login function
  const login = async (token: string, userData: User) => {
    try {
      // Store token and user data in AsyncStorage
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("userId", userData.id);
      await AsyncStorage.setItem("username", userData.username);
      if (userData.email) {
        await AsyncStorage.setItem("userEmail", userData.email);
      }

      // Update the user state
      setUser(userData);
    } catch (error) {
      console.log("Error logging in:", error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Remove auth data from AsyncStorage
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("userId");
      await AsyncStorage.removeItem("username");
      await AsyncStorage.removeItem("userEmail");

      // Reset the user state
      setUser(null);

      // Redirect to login screen
      router.replace("/login");
    } catch (error) {
      console.log("Error logging out:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}
