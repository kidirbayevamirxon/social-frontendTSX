import { Button } from "../ui/button";
import leftStrelka from "/arrow-left-solid.svg";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import search from "/magnifying-glass-solid.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import user from "/user-solid.svg";
import { LoaderIcon } from "lucide-react";

interface UserSearchResult {
  username: string;
  has_followed: boolean;
  user_img: string;
}

function Search() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userName = localStorage.getItem("username");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);

    if (!token) {
      toast.error("Iltimos, avval tizimga kiring");
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use((config) => {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Iltimos, qidiruv uchun ma'lumot kiriting");
      return;
    }

    if (!isAuthenticated) {
      toast.error("Siz tizimga kirmagansiz");
      navigate("/");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://social-backend-kzy5.onrender.com/search",
        {
          params: { username: searchTerm },
        }
      );

      setSearchResults(response.data);
    } catch (err) {
      setSearchResults(null);

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          toast.error("Sessiya muddati tugagan, iltimos qayta kiring");
          localStorage.removeItem("accessToken");
          navigate("/");
        } else if (err.response?.status === 404) {
          toast.error("Foydalanuvchi topilmadi");
        } else if (err.response?.status === 422) {
          toast.error(err.response.data?.msg || "Noto'g'ri qidiruv ma'lumoti");
        } else {
          toast.error(err.message || "Server xatosi yuz berdi");
        }
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Noma'lum xato yuz berdi");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleFollow = async () => {
    if (!searchResults || isFollowing) return;
    const token = localStorage.getItem("access_token");
    setIsFollowing(true);
    try {
      const token = localStorage.getItem("access_token");
      const currentUsername = localStorage.getItem("username");

      if (!token || !currentUsername) {
        toast.error("Avval tizimga kiring");
        navigate("/ ");
        return;
      }

      let endpoint = `https://social-backend-kzy5.onrender.com/followings/follow`;
      let requestData = { username: currentUsername };

      let response = await axios.post(endpoint, requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(response.data?.message || "Muvaffaqiyatli follow qilindi");
      setSearchResults({
        ...searchResults,
        has_followed: true,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const currentUsername = localStorage.getItem("username");
        if (err.response?.status === 400) {
          try {
            const unfollowResponse = await axios.post(
              `https://social-backend-kzy5.onrender.com/followings/unfollow`,
              { username: currentUsername },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            toast.success(
              unfollowResponse.data?.message ||
                "Muvaffaqiyatli unfollow qilindi"
            );
            setSearchResults({
              ...searchResults,
              has_followed: false,
            });
          } catch (unfollowErr) {
            if (axios.isAxiosError(unfollowErr)) {
              toast.error(
                unfollowErr.response?.data?.message || "Unfollow qilishda xato"
              );
            } else {
              toast.error("Unfollow qilishda noma'lum xato");
            }
          }
        } else if (err.response?.status === 401) {
          toast.error("Sessiya tugadi, iltimos qayta kiring");
          localStorage.removeItem("access_token");
          navigate("/");
        } else {
          toast.error(err.response?.data?.message || "Follow qilishda xato");
        }
      } else {
        toast.error("Noma'lum xato yuz berdi");
      }
    } finally {
      setIsFollowing(false);
    }
  };
  return (
    <div className="bg-black w-full h-screen overflow-hidden">
      <Button
        className="w-[80px] h-18 ml-[10%] mt-14"
        onClick={() => navigate("/dashboard")}
      >
        <img src={leftStrelka} alt="Orqaga" className="w-xl h-15" />
      </Button>

      <div className="flex items-center justify-center gap-0 mt-10">
        <Input
          className="w-[60%] h-[80px] border-r-o rounded-l-2xl rounded-r-none text-white !text-3xl p-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Foydalanuvchi nomini kiriting"
        />
        <Button
          className="flex p-2 pl-4 pr-4 border-white border-2 border-l-0 rounded-bl-none rounded-r-2xl h-[80px]"
          onClick={handleSearch}
          disabled={isLoading}
        >
          <img src={search} className="w-[60px]" alt="Qidiruv" />
        </Button>
      </div>

      {isLoading && (
        <div className="text-white flex justify-center mt-8 text-2xl">
          <LoaderIcon className="w-[50px] h-[50px]" />{" "}
        </div>
      )}

      {searchResults && (
        <div className="mt-12 text-white flex flex-col items-center">
          <h2 className="text-3xl mb-6 font-bold">Qidiruv Natijalari</h2>
          <div className="bg-gray-800 p-6 rounded-lg w-[60%] space-y-4 flex items-start gap-4">
            <div className="flex-shrink-0">
              <img
                src={searchResults.user_img || `${user}`}
                alt={searchResults.username}
                className="w-20 h-20 rounded-full object-cover border-2 border-white"
                onError={(e) => {
                  e.currentTarget.src = user;
                }}
              />
            </div>

            <div className="flex-grow space-y-3">
              <p className="text-2xl">
                <strong>Foydalanuvchi nomi:</strong> {userName}
              </p>

              <p className="text-xl">
                <strong>Holati:</strong>{" "}
                {searchResults.has_followed
                  ? "Follow qilingan"
                  : "Follow qilinmagan"}
              </p>

              <Button
                className="mt-4 w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                onClick={handleFollow}
                disabled={isFollowing}
              >
                {isFollowing
                  ? "Amalga oshirilmoqda..."
                  : searchResults.has_followed
                  ? "Unfollow qilish"
                  : "Follow qilish"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
