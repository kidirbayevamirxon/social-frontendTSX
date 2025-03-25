import { useState } from "react";
import { usePostRequest } from "../Request/UsePostRequest";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { useNavigate } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

type MyResponseType = {
  success?: boolean;
  message?: string;
  status?: number;
  data?: {
    access_token?: string;
    refresh_token?: string;
  };
};

function Sign() {
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUserName] = useState("");
  const {loading, error, postData } = usePostRequest<MyResponseType>(
    "https://social-backend-kzy5.onrender.com/auth/sign-up"
  );
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await postData({
        body: {
          first_name,
          last_name,
          email,
          password,
          username,
        },
      });

      if (
        result &&
        (result.message === "user successfully created" ||
          result.status === 201)
      ) {
        navigate("/");
      } else {
        console.error("Ro‘yxatdan o‘tishda xatolik:", result);
      }
    } catch (error) {
      console.error("Serverga so‘rov yuborishda xatolik:", error);
    }
  };

  return (
    <>
      <div className="p-0">
        <div className="w-1/4 h-1/2 border border-black my-24 mx-auto rounded-[20px] p-0">
          <div className="flex justify-center">
            <h2 className="text-5xl mt-6">Login</h2>
          </div>
          <form className="flex flex-col p-8 gap-4">
            <Label htmlFor="first-name">First-Name</Label>
            <Input
              placeholder="First-Name"
              id="first-name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              required
            ></Input>

            <Label htmlFor="last-name">Last-Name</Label>
            <Input
              placeholder="Last-Name"
              id="last-name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              required
            ></Input>

            <Label htmlFor="username">username</Label>
            <Input
              placeholder="Username"
              id="username"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              required
            ></Input>

            <Label htmlFor="email">Email</Label>
            <Input
              placeholder="Email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            ></Input>

            <Label htmlFor="password">Password</Label>
            <Input
              placeholder="Password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            ></Input>

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
    </>
  );
}

export default Sign;
