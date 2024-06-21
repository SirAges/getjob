import { io } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import { domain } from "../constants/main";

export const useSocket = () => {
    const { id, expoPushToken } = useAuth();
  
    return io.connect(domain, {
        query: { userId: id, pushToken: expoPushToken }
    });
};
