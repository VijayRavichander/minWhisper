import { useEffect, useState, useRef } from "react";
import "./App.css";

interface Messages {
  message: string;
  senderId: string;
}
function App() {
  const [messages, setMessages] = useState<Messages[]>([
    { message: "Hellos", senderId: "system" },
    { message: "Wassup", senderId: "system" },
  ]);
  const [chatBox, setChatBox] = useState<string>();
  const wsRef = useRef<WebSocket>();
  const userId = useRef<string>(Math.random().toString(36).substring(2, 15));

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setMessages((m) => [...m, parsedData]);
    };

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: "123",
          },
        })
      );
    };

    return () => {
      ws.close();
    };
  });

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatBox(e.target.value);
  };

  const sendMessage = () => {
    if (chatBox?.trim()) {
      const messageToSend = chatBox;

      wsRef.current?.send(
        JSON.stringify({
          type: "chat",
          payload: {
            message: messageToSend,
            senderId: userId.current,
          },
        })
      );
    }

    setTimeout(() => {
      setChatBox("");
    }, 100);
  };

  return (
    <div className="flex flex-col justify-center h-screen bg-black">
      <div className="h-[85vh] mt-10">
        {messages.map((m, index) => (
          <div
            key={index}
            className={`my-10 mx-2 ${
              m.senderId === userId.current ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`p-4 rounded-xl border-2 ${
                m.senderId === userId.current
                  ? "text-white border-blue-500"
                  : "text-white border-red-500"
              }`}
            >
              {m.message}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-center p-4">
        <div className="w-full max-w-lg flex gap-2">
          <input
            type="text"
            className="w-full p-2 text-white bg-black border border-gray-300 rounded-md focus:outline-none focus:none focus:none"
            placeholder="Type your message..."
            value={chatBox}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            onChange={onInputChange}
          />
          <button
            className="px-4 py-2 bg--500 text-white rounded-md border-2 border-green-300 hover:bg-green-900 focus:outline-none focus:none"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
