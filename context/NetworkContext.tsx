import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import NetInfo from "@react-native-community/netinfo";

interface NetworkContextType {
  isConnected: boolean;
  isInitialized: boolean;
}

const NetworkContext = createContext<NetworkContextType>({
  isConnected: true,
  isInitialized: false,
});

export const useNetwork = () => useContext(NetworkContext);

interface NetworkProviderProps {
  children: ReactNode;
}

export const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
      if (!isInitialized) {
        setIsInitialized(true);
      }
    });

    // Initial fetch of network state
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected ?? true);
      setIsInitialized(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const value = {
    isConnected,
    isInitialized,
  };

  return (
    <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>
  );
};

export default NetworkContext;
