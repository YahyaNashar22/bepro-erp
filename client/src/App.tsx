import { useEffect } from "react";
import { io } from "socket.io-client";

import "./App.css";

import AppRouter from "../routes/AppRouter.tsx";

function App() {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_BACKEND_URL, {
      transports: ["websocket"],
    });

    socket.on("connect", () => console.log("connected to server", socket.id));
    socket.on("disconnect", () =>
      console.log("disconnected from server", socket.id)
    );

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
