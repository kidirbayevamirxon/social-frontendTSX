import { Button } from "../ui/button";
import leftStrelka from "/arrow-left-solid.svg";
import user from "/user-solid (1).svg";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";

function Profile() {
  const [user_image, setUser_image] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [first_name, setFirstName] = useState<string>("");
  const [last_name, setLastName] = useState<string>("");
  const [username, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [followers, setFollowers] = useState<number>(0);
  const [followings, setFollowings] = useState<number>(0);
  const [has_followed, setHas_Followed] = useState<boolean>(false);
  const [userImage, setUserImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUser_image(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleUserImg = async (): Promise<void> => {
    if (!user_image) {
      setError("⚠️ Fayl tanlanmagan!");
      return;
    }

    const formData = new FormData();
    formData.append("file", user_image);

    let token = localStorage.getItem("access_token");

    if (!token) {
      setError("⚠️ Avtorizatsiya tokeni topilmadi!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://social-backend-kzy5.onrender.com/image/user",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUserImage(preview);
        setError(null);
      }
    } catch (err) {
      console.error("❌ Rasm yuklashda xatolik:", err);
      setError("❌ Rasm yuklashda muammo yuz berdi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const storedUsername = localStorage.getItem("username");
    console.log(storedUsername);

    if (!token) {
      console.error("⚠️ Token topilmadi!");
      navigate("/");
      return;
    }

    axios
      .get("https://social-backend-kzy5.onrender.com/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
        params: { username: storedUsername },
      })
      .then((res) => {
        console.log("✅ User data:", res.data);
        const userData =
          Array.isArray(res.data) && res.data.length > 0 ? res.data[0] : null;

        if (userData) {
          setUser_image(userData.user_img || null);
          setFirstName(userData.first_name || "No name");
          setLastName(userData.last_name || "No surname");
          setUserName(userData.username || "No username");
          setFollowers(userData.followers || 0);
          setFollowings(userData.followings || 0);
          setEmail(userData.email || "No email");
        } else {
          console.error("❌ Foydalanuvchi ma'lumotlari topilmadi!");
        }
      })
      .catch((error) => {
        console.error("❌ Xatolik:", error.response?.data || error.message);
      });
  }, []);

  return (
    <div className="bg-black w-full h-screen overflow-hidden">
      <Button
        className="w-[80px] h-18 ml-[10%] mt-14"
        onClick={() => navigate("/dashboard")}
      >
        <img src={leftStrelka} alt="Back" className="w-xl h-15" />
      </Button>
      <div className="flex flex-col items-center">
        <div className="w-[80%] h-auto bg-neutral-200 mt-20 rounded-3xl p-4">
          <div className="w-[100%] h-auto rounded-3xl p-16 bg-white shadow-md shadow-orange-50">
            <div className="text-center flex flex-col items-center gap-5">
              <span className="text-xl">Will you change your avatar?</span>
              <Input
                type="file"
                accept="image/*"
                className="w-1xl"
                onChange={handleFileChange}
              />
              {preview && (
                <img
                  src={preview}
                  alt="Avatar Preview"
                  className="w-32 h-32 rounded-full object-cover"
                />
              )}

              <Button onClick={handleUserImg} disabled={loading}>
                {loading ? (
                  <LoaderCircle className="animate-spin w-8 h-8" />
                ) : (
                  "Upload"
                )}
              </Button>
              {error && <p className="text-red-500">{error}</p>}
            </div>
          </div>
        </div>
        <div className="w-[80%] h-auto bg-neutral-200 mt-20 rounded-3xl p-4">
          <div className="w-[100%] h-auto rounded-3xl p-8 bg-white shadow-md shadow-orange-50 flex justify-around items-center">
            <div>
              <div className="flex gap-8 items-center mt-4">
                <img
                  className="w-[60px] h-[60px] rounded-4xl"
                  src={preview || userImage || user}
                  alt="User Avatar"
                />
                <div>
                  <p className="text-3xl">{username}</p>
                  <p className="mt-2">{email}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-8 w-xl pl-32">
              <p className="text-2xl">{first_name}</p>
              <p className="text-2xl">{last_name}</p>
            </div>
            <div className="flex gap-4">
              <p className="flex gap-4">Follow {followers}</p>
              <p className="flex gap-4">Followed {followings}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
