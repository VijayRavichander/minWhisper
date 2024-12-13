import { useEffect, useState, useRef } from "react";
import Logo from "./Logo";
import { useParams } from "react-router-dom";

interface Messages {
  message: string;
  senderId: string;
}

function ChatPage() {
  const [messages, setMessages] = useState<Messages[]>([]);
  const [chatBox, setChatBox] = useState<string>();
  const wsRef = useRef<WebSocket>();
  const userId = useRef<string>(Math.random().toString(36).substring(2, 15));
  const { roomId } = useParams();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom when messages are updated
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, parsedData]);
    };

    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: {
            roomId: roomId,
          },
        })
      );
    };

    return () => {
      ws.close();
    };
  }, [roomId]);

  // Update chat box value on input change
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatBox(e.target.value);
  };

  // Send message to the server
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

    setChatBox("");
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col justify-center bg-black">
      <Logo />
      <div className="flex flex-col h-[70vh] w-screen bg-neutral-950 rounded-lg shadow-md">
        {/* Chat messages container */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-2   
        [&::-webkit-scrollbar]:w-1
  [&::-webkit-scrollbar-track]:bg-green-100
  [&::-webkit-scrollbar-thumb]:bg-green-400"
        >
          {messages.map((m, index) => (
            <div
              key={index}
              className={`my-2 ${
                m.senderId === userId.current ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block p-3 rounded-xl border-2 ${
                  m.senderId === userId.current
                    ? "text-white border-blue-500 bg-blue-900"
                    : "text-white border-red-500 bg-red-900"
                }`}
              >
                {m.message}
              </span>
            </div>
          ))}
          {/* Scroll indicator */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex justify-center px-4 py-10">
        <div className="w-full max-w-lg flex gap-2">
          <input
            type="text"
            className="w-full p-2 text-white bg-black border border-gray-300 rounded-md focus:outline-none"
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
            className="px-4 py-2 bg-green-500 text-white rounded-md border-2 border-green-300 hover:bg-green-900"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
