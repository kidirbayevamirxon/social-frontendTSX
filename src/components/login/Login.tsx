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
  };
  useEffect(() => {
    if (data?.message === "login success" && data.access_token) {
      localStorage.setItem("access_token", data.access_token);
      setTimeout(() => {
        console.log("⏳ 2 soniyadan keyin dashboardga yo‘naltiriladi...");
        navigate("/dashboard");
      }, 2000);
    }
  }, [data]);

  return (
    <div className="p-0">
      <div className="w-1/5 h-1/2 border border-black my-24 mx-auto rounded-[20px] p-0">
        <div className="flex justify-center">
          <h2 className="text-5xl mt-6">Login</h2>
        </div>
        <form className="flex flex-col p-8 gap-4" onSubmit={handleSubmit}>
          <Label htmlFor="username">Username</Label>
          <Input
            placeholder="Username"
            id="username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex gap-8 m-auto">
            <Link to="/sign">Sign-Up</Link>
            <Link to="/reset-pass">Reset-Pass</Link>
          </div>

          <Button type="submit">
            {loading ? (
              <LoaderCircle className="animate-spin w-8 h-8" />
            ) : (
              "Submit"
            )}
          </Button>
          {error && <p className="text-red-500">Xatolik: {error}</p>}
        </form>
      </div>
    </div>
  );
}

export default Login;
