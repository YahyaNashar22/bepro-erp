import { useEffect } from "react";
import { io } from "socket.io-client";

import "./App.css";

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
      <h1>Socket.IO Connected Frontend</h1>
    </>
  );
}

export default App;
