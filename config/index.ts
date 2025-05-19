import { Platform } from "react-native";

// Get the appropriate base URL depending on the platform
const getBaseUrl = () => {
  if (Platform.OS === "android") {
    // For physical Android devices, use the computer's local IP
    return "http://192.168.1.12:8000";
  } else if (Platform.OS === "ios") {
    // For physical iOS devices, use the computer's local IP
    return "http://192.168.1.12:8000";
  }
  return "http://192.168.1.12:8000";
};

const SERVER_URL = "http://192.168.1.12:8000";

export const API_URL = getBaseUrl();

// You can add more configuration variables here as needed
export const config = {
  API_URL,
  SERVER_URL,
};

export default config;
