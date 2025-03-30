import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import defaultUser from "/user-solid.svg";
import { Button } from "../ui/button";

interface UserProfile {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  followers: number;
  following: number;
  user_img: string;
  has_followed: boolean;
}

function UserProfile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!username) {
        console.error("Xatolik: Username aniqlanmadi!");
        return;
      }

      try {
        const token = localStorage.getItem("access_token");
        if (!token) {
          toast.error("Iltimos, avval tizimga kiring");
          navigate("/");
          return;
        }

        console.log(`Foydalanuvchi profili yuklanmoqda: ${username}`);

        const response = await axios.get(
          `https://social-backend-kzy5.onrender.com/auth/user`, // ✅ To‘g‘ri API yo‘li
          {
            params: { username }, // ✅ Query orqali username yuboriladi
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data || response.data.length === 0) {
          toast.error("Foydalanuvchi topilmadi");
          return;
        }

        const userData = response.data[0]; // Faqat bitta user olinadi
        setUser(userData);
        setIsFollowing(userData.has_followed);
        setFollowersCount(userData.followers || 0);
      } catch (error) {
        console.error("Foydalanuvchi profilini yuklashda xatolik:", error);

        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            toast.error("Foydalanuvchi topilmadi");
          } else if (error.response?.status === 401) {
            toast.error("Iltimos, profilni ko'rish uchun tizimga kiring");
          } else {
            toast.error("Profil yuklanmadi");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUserProfile();
    }
  }, [username, navigate]);

  const handleFollow = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const endpoint = isFollowing
        ? "https://social-backend-kzy5.onrender.com/followings/unfollow"
        : "https://social-backend-kzy5.onrender.com/followings/follow";

      await axios.post(
        endpoint,
        { username },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsFollowing(!isFollowing);
      setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
      toast.success(
        isFollowing ? "Kuzatish to'xtatildi" : "Muvaffaqiyatli kuzatildi"
      );
    } catch (error) {
      console.error("Error following user:", error);
      toast.error("Kuzatish holatini yangilashda xato");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <p className="text-gray-600">Foydalanuvchi topilmadi</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="relative">
              <img
                src={user.user_img || defaultUser}
                alt={user.username}
                className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover border-4 border-indigo-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = defaultUser;
                }}
              />
              {isFollowing && (
                <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <Button
              variant={isFollowing ? "outline" : "default"}
              className="w-full md:w-auto px-6 m-auto"
              onClick={handleFollow}
            >
              {isFollowing ? "Followed" : "Follow"}
            </Button>
          </div>

          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-gray-600">@{user.username}</p>
            </div>

            <div className="flex space-x-6 mb-6">
              <div className="text-center">
                <p className="font-bold text-gray-800">0</p>
                <p className="text-gray-500 text-sm">Postlar</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">{followersCount}</p>
                <p className="text-gray-500 text-sm">Kuzatuvchilar</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-800">{user.following || 0}</p>
                <p className="text-gray-500 text-sm">Kuzatilganlar</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Aloqa</h3>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
