import { Platform } from "react-native";

const getBaseUrl = () => {
  if (Platform.OS === "android") {
    return "http://192.168.1.6:8000";
  } else if (Platform.OS === "ios") {
    return "http://192.168.1.6:8000";
  }
  return "http://192.168.1.6:8000";
};

export const API_URL = getBaseUrl();

export const config = {
  API_URL,
};

export default config;
