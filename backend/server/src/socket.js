let ioInstance;

export const initializeSocket = (io) => {
  ioInstance = io;
};

export const getIo = () => {
  if (!ioInstance) {
    throw new Error("Socket.io is not initialized.");
  }

  return ioInstance;
};
