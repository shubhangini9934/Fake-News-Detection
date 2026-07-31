import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL || "";

export const useSocket = (handlers) => {
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const socket = io(API_URL, {
      transports: ["websocket", "polling"]
    });

    socket.on("news:update", (payload) => handlersRef.current?.onNewsUpdate?.(payload));
    socket.on("news:breaking", (payload) => handlersRef.current?.onBreakingNews?.(payload));
    socket.on("verify:created", (payload) =>
      handlersRef.current?.onVerificationCreated?.(payload)
    );

    return () => {
      socket.disconnect();
    };
  }, []);
};
