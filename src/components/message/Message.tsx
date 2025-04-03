import { useState, useEffect, useRef, useCallback } from "react";
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

const API_URL =
  process.env.REACT_APP_API_URL || "https://social-backend-kzy5.onrender.com";
const WS_URL = process.env.REACT_APP_WS_URL || "ws://localhost:3000";

function ChatApp({ currentUser }: ChatAppProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Foydalanuvchilarni yuklash
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${API_URL}/auth/users`);
        setUsers(
          response.data.map((username: string) => ({
            id: username,
            username,
          }))
        );
      } catch (err) {
        setError("Foydalanuvchilarni yuklab bo'lmadi");
        console.error("Foydalanuvchilarni olishda xatolik:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // WebSocket ulanishi
  useEffect(() => {
    if (!currentUser || typeof currentUser !== "string") {
      setError("Foydalanuvchi aniqlanmadi");
      return;
    }

    socketRef.current = io(WS_URL, {
      transports: ["websocket"],
      query: { userId: currentUser },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
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

    socketRef.current.on("connect_error", (err) => {
      setError("Serverga ulanishda xatolik");
      console.error("Connection error:", err);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [currentUser]);

  // Tanlangan foydalanuvchi o'zgarganda chat tarixini yuklash
  useEffect(() => {
    if (selectedUser && socketRef.current) {
      setIsLoading(true);
      socketRef.current.emit(
        "getChatHistory",
        {
          userId: currentUser,
          contactId: selectedUser,
        },
        () => {
          setIsLoading(false);
        }
      );
    }
  }, [selectedUser, currentUser]);

  // Xabarlar o'zgarganda avtomatik scroll qilish
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Xabarlarni "o'qilgan" deb belgilash
  useEffect(() => {
    if (selectedUser && socketRef.current) {
      const unreadMessages = messages.filter(
        (msg) => msg.sender === selectedUser && msg.status !== "read"
      );

      if (unreadMessages.length > 0) {
        socketRef.current.emit("markAsRead", {
          messages: unreadMessages.map((msg) => msg.id),
          reader: currentUser,
        });

        setMessages((prev) =>
          prev.map((msg) =>
            msg.sender === selectedUser && msg.status !== "read"
              ? { ...msg, status: "read" }
              : msg
          )
        );
      }
    }
  }, [messages, selectedUser, currentUser]);

  // Xabar yuborish
  const sendMessage = useCallback(() => {
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
  }, [newMessage, selectedUser, currentUser]);

  // Enter bosganda xabar yuborish
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  // Xabar komponenti
  const MessageBubble = ({
    message,
    isCurrentUser,
  }: {
    message: Message;
    isCurrentUser: boolean;
  }) => {
    return (
      <div
        className={`mb-4 flex ${
          isCurrentUser ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`max-w-xs p-3 rounded-lg ${
            isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          <p>{message.text}</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs opacity-70">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {isCurrentUser && (
              <span className="text-xs ml-2">
                {message.status === "read"
                  ? "✓✓"
                  : message.status === "delivered"
                  ? "✓"
                  : ""}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Foydalanuvchilar paneli */}
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

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            {users.map((user) => (
              <div
                key={user.id}
                className={`p-3 hover:bg-gray-100 cursor-pointer flex items-center ${
                  selectedUser === user.username ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedUser(user.username)}
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {messages.find(
                      (m) =>
                        m.sender === user.username ||
                        m.receiver === user.username
                    )?.text || "Hech qanday xabar yo'q"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat maydoni */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-white flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                {users.find((u) => u.username === selectedUser)?.avatar ? (
                  <img
                    src={users.find((u) => u.username === selectedUser)?.avatar}
                    alt={selectedUser}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-600 font-medium">
                    {selectedUser.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                {selectedUser}
              </h2>
            </div>

            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    {selectedUser} bilan hech qanday xabar yo'q. Xabar yozishni
                    boshlang!
                  </div>
                ) : (
                  messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      isCurrentUser={message.sender === currentUser}
                    />
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            )}

            <div className="p-4 bg-white border-t border-gray-200 flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Xabar yozing..."
                className="flex-1 p-2 border rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={!isConnected}
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || !isConnected}
                className={`ml-3 p-2 rounded-lg ${
                  !newMessage.trim() || !isConnected
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                Yuborish
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Suhbatdoshlardan birini tanlang
          </div>
        )}
      </div>

      {/* Xato xabarlari */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-500 text-white p-3 rounded shadow-lg animate-fade-in">
          {error}
          <button onClick={() => setError(null)} className="ml-2 font-bold">
            ×
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatApp;
