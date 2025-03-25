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
        code:password,
        newPassword,
      },
    });
    if (data?.message === "login success") {
      navigate("/dashboard");
    }
  };
  return (
    <div className="p-0">
      <div className="w-1/4 h-1/2 border border-black my-24 mx-auto rounded-[20px] p-0">
        <div className="flex justify-center">
          <h2 className="text-5xl mt-6">Login</h2>
        </div>
        <form className="flex flex-col p-8 gap-4">
          <Label htmlFor="username">Username</Label>
          <Input
            placeholder="Username"
            id="username"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          ></Input>
          <Label htmlFor="password">Password</Label>
          <Input
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e)=> setPassword(Number(e.target.value))}
          ></Input>
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            placeholder="New Password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          ></Input>

          <Link to="/" className="ml-[65%]">
            Login
          </Link>

          <Button onClick={handleSubmit}>
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

export default ResetPass;
