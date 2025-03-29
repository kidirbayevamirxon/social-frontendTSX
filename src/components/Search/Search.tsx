import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import searchIcon from "/magnifying-glass-solid.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import defaultUser from "/user-solid.svg";
import { Loader2 } from "lucide-react";

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

  // Oq filter qo'shish uchun
  const whiteFilter = {
    filter: "brightness(0) invert(1)",
    opacity: 0.9,
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Iltimos, avval tizimga kiring");
      navigate("/");
    }
  }, [navigate]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.error("Iltimos, foydalanuvchi nomini kiriting");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://social-backend-kzy5.onrender.com/search",
        {
          params: { username: searchTerm.trim() },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        const userData = response.data[0];
        setSearchResults({
          username: userData.username,
          has_followed: userData.has_followed || false,
          user_img: userData.user_img || defaultUser,
        });
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults(null);
      toast.error("Foydalanuvchi topilmadi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleFollow = async () => {
    if (!searchResults || isFollowing) return;

    setIsFollowing(true);
    try {
      const endpoint = searchResults.has_followed
        ? "https://social-backend-kzy5.onrender.com/followings/unfollow"
        : "https://social-backend-kzy5.onrender.com/followings/follow";

      const response = await axios.post(
        endpoint,
        { username: searchResults.username },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      toast.success(
        response.data?.message ||
          (searchResults.has_followed ? "Unfollow qilindi" : "Follow qilindi")
      );

      setSearchResults((prev) =>
        prev
          ? {
              ...prev,
              has_followed: !prev.has_followed,
            }
          : null
      );
    } catch (error) {
      console.error("Follow error:", error);
      toast.error("Amalni bajarishda xato");
    } finally {
      setIsFollowing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mt-8">
          <Input
            className="flex-1 h-14 text-lg px-6 rounded-full bg-gray-800 border-gray-700 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Foydalanuvchi nomini kiriting"
          />
          <Button
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700"
            onClick={handleSearch}
            disabled={isLoading}
          >
            <img
              src={searchIcon}
              alt="Search"
              className="w-6 h-6"
              style={whiteFilter}
            />
          </Button>
        </div>
        {isLoading && (
          <div className="flex justify-center mt-12">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
          </div>
        )}
        {searchResults && (
          <div className="mt-8 bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={searchResults.user_img}
                  alt={searchResults.username}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = defaultUser;
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white">
                  {searchResults.username}
                </h3>
                <p className="text-gray-300 mt-1">
                  {searchResults.has_followed
                    ? "Siz follow qilgansiz"
                    : "Follow qilmagansiz"}
                </p>

                <Button
                  className="mt-4 w-full py-3 text-lg"
                  variant={searchResults.has_followed ? "outline" : "default"}
                  onClick={handleFollow}
                  disabled={isFollowing}
                >
                  {isFollowing
                    ? "Jarayonda..."
                    : searchResults.has_followed
                    ? "Unfollow"
                    : "Follow"}
                </Button>
              </div>
            </div>
          </div>
        )}
        {!searchResults && !isLoading && (
          <div className="text-center mt-12 text-gray-400">
            <p>Qidiruv natijalari bu yerda ko'rinadi</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
