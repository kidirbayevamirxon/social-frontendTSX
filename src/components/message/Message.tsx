import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { io, Socket } from "socket.io-client";

interface User {
  id: string;
  username: string;
  avatar?: string;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  receiver: string;
  timestamp: string;
  status?: "delivered" | "read";
}

interface ChatAppProps {
  currentUser: string;
}

function ChatApp({ currentUser }: ChatAppProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Foydalanuvchilar ro'yxatini olish
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "https://social-backend-kzy5.onrender.com/auth/users"
        );
        setUsers(
          response.data.map((username: string) => ({ id: username, username }))
        );
      } catch (error) {
        console.error("Foydalanuvchilarni olishda xatolik:", error);
      }
    };

    fetchUsers();
  }, []);

  // WebSocket ulanishini o'rnatish
  useEffect(() => {
    if (!currentUser) {
      console.error("currentUser is undefined or null");
      return; // currentUser mavjud bo'lmasa, WebSocket ulanishini boshlamaymiz
    }

    socketRef.current = io("ws://localhost:3000", {
      transports: ["websocket"],
      query: { userId: currentUser },
    });

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("WebSocket connected");
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      console.log("WebSocket disconnected");
    });

    socketRef.current.on("message", (message: Message) => {
      if (
        message.sender === selectedUser ||
        message.receiver === selectedUser
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socketRef.current.on("previousMessages", (chatHistory: Message[]) => {
      setMessages(chatHistory);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [currentUser]);

  // Tanlangan foydalanuvchi o'zgarganda chat tarixini yuklash
  useEffect(() => {
    if (selectedUser && socketRef.current) {
      socketRef.current.emit("getChatHistory", {
        userId: currentUser,
        contactId: selectedUser,
      });
    }
  }, [selectedUser, currentUser]);

  // Avtomatik scroll qilish
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Xabar yuborish
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser || !socketRef.current) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: currentUser,
      receiver: selectedUser,
      timestamp: new Date().toISOString(),
      status: "delivered",
    };

    socketRef.current.emit("sendMessage", message);
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat ro'yxati paneli */}
      <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Chatlar</h2>
          <div
            className={`text-xs ${
              isConnected ? "text-green-500" : "text-red-500"
            }`}
          >
            {isConnected ? "Online" : "Offline"}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {users &&
            users.map((user, index) =>
              user && user.username ? (
                <div key={index}>{user.username.charAt(0).toUpperCase()}</div>
              ) : (
                <div key={index}>User not found</div>
              )
            )}
        </div>
      </div>

      {/* Chat oynasi */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat sarlavhasi */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                {users.find((u) => u.username === selectedUser)?.avatar ? (
                  <img
                    src={users.find((u) => u.username === selectedUser)?.avatar}
                    alt={selectedUser}
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <span className="text-gray-600">
                    {selectedUser.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                {selectedUser}
              </h2>
            </div>

            {/* Xabarlar maydoni */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  {selectedUser} bilan hech qanday xabar yo'q. Xabar yozishni
                  boshlang!
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 flex ${
                      message.sender === currentUser
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        message.sender === currentUser
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200"
                      }`}
                    >
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Xabar yozish paneli */}
            <div className="p-4 bg-white border-t border-gray-200 flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Xabar yozing..."
                className="flex-1 p-2 border rounded-lg text-gray-800"
              />
              <button
                onClick={sendMessage}
                className="ml-3 p-2 bg-blue-500 text-white rounded-lg"
              >
                Yuborish
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Tanlangan foydalanuvchi yo'q
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatApp;
