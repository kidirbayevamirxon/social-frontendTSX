import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { usePostRequest } from "../Request/UsePostRequest";
import { Label } from "@radix-ui/react-label";
import { useState, useEffect } from "react";
import { LoaderCircle } from "lucide-react";

type MyResponseType = {
  success: boolean;
  message: string;
  access_token?: string;
  refresh_token?: string;
};

function Login() {
  const [username, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const { data, loading, error, postData } = usePostRequest<MyResponseType>(
    "https://social-backend-kzy5.onrender.com/auth/login"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postData({
      body: {
        username,
        password,
      },
    });
    localStorage.setItem("username", username);
  };

  useEffect(() => {
    if (data?.message === "login success" && data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      setTimeout(() => {
        console.log("⏳ 2 soniyadan keyin dashboardga yo'naltiriladi...");
        navigate("/dashboard");
      }, 1000);
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 py-6 px-8 text-center">
          <h2 className="text-3xl font-bold text-white">Login</h2>
        </div>
        
        <form className="p-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Foydalanuvchi nomi
            </Label>
            <Input
              placeholder="Foydalanuvchi nomingizni kiriting"
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Parol
            </Label>
            <Input
              type="password"
              placeholder="Parolingizni kiriting"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Link 
              to="/reset-pass" 
              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Parolni unutdingizmi?
            </Link>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <LoaderCircle className="animate-spin mr-2" />
                Kirish...
              </div>
            ) : (
              "Kirish"
            )}
          </Button>
          
          <div className="text-center text-sm text-gray-600">
            Hisobingiz yo'qmi?{" "}
            <Link 
              to="/sign" 
              className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
            >
              Ro'yxatdan o'tish
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;