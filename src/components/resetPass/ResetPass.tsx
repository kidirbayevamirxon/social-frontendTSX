import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePostRequest } from "../Request/UsePostRequest";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type MyResponseType = {
  success: boolean;
  message: string;
  data?: any;
};

function ResetPass() {
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<number>();
  const [newPassword, setNewPassword] = useState<string>("");
  const navigate = useNavigate();

  const { data, loading, error, postData } = usePostRequest<MyResponseType>(
    "https://social-backend-kzy5.onrender.com/auth/reset-pass"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postData({
      body: {
        username,
        code: password,
        newPassword,
      },
    });
    if (data?.message === "login success") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 py-6 px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Parolni Tiklash</h2>
        </div>
        <form className="p-8 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Foydalanuvchi nomi
            </Label>
            <Input
              placeholder="Foydalanuvchi nomingizni kiriting"
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Tasdiqlash kodi
            </Label>
            <Input
              type="number"
              placeholder="Sizga yuborilgan tasdiqlash kodi"
              id="password"
              value={password}
              onChange={(e) => setPassword(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Yangi parol
            </Label>
            <Input
              type="password"
              placeholder="Yangi parolni kiriting"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div className="flex justify-end">
            <Link
              to="/"
              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Tizimga kirish
            </Link>
          </div>
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 mt-4"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoaderCircle className="animate-spin mr-2" />
                Amalga oshirilmoqda...
              </div>
            ) : (
              "Parolni tiklash"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ResetPass;
