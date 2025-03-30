import { Button } from "../ui/button";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "../ui/input";
import searchIconBlack from "/searchIconBlack.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import defaultUser from "/user-solid (1).svg";
import { Loader2 } from "lucide-react";

interface UserSearchResult {
  username: string;
  has_followed: boolean;
  user_img: string;
  first_name: string;
  last_name: string;
}

function Search() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState<{ [key: string]: boolean }>(
    {}
  );

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

      setSearchResults(
        response.data.map((user: any) => ({
          username: user.username,
          has_followed: user.has_followed || false,
          user_img: user.user_img || defaultUser,
        }))
      );
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      toast.error("Foydalanuvchi topilmadi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleFollow = async (username: string, currentStatus: boolean) => {
    setIsFollowing((prev) => ({ ...prev, [username]: true }));
    try {
      const endpoint = currentStatus
        ? "https://social-backend-kzy5.onrender.com/followings/unfollow"
        : "https://social-backend-kzy5.onrender.com/followings/follow";

      const response = await axios.post(
        endpoint,
        { username },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      toast.success(
        response.data?.message ||
          (currentStatus ? "Unfollow qilindi" : "Follow qilindi")
      );

      setSearchResults((prev) =>
        prev.map((user) =>
          user.username === username
            ? { ...user, has_followed: !user.has_followed }
            : user
        )
      );
    }  catch (error) {
      console.error("Follow error:", error);
  
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Iltimos, tizimga qayta kiring");
        navigate("/"); 
      } else {
        toast.error("Amalni bajarishda xato");
      }
    } finally {
      setIsFollowing((prev) => ({ ...prev, [username]: false }));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Search Users
          </h1>
          <p className="text-gray-500 mt-2">
            Find and connect with other users
          </p>
        </div>
        <div className="flex items-center gap-3 mb-8">
          <div className="relative flex-1">
            <img
              src={searchIconBlack}
              alt="Search"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-70"
            />
            <Input
              className="pl-12 pr-4 py-6 text-base rounded-xl bg-white border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter username..."
            />
          </div>
          <Button
            className="py-6 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700"
            onClick={handleSearch}
            disabled={isLoading}
          >
            Search
          </Button>
        </div>
        {isLoading && (
          <div className="flex justify-center mt-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        )}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            {searchResults.map((user) => (
              <div
                key={user.username}
                className="bg-white rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <Link
                    to={`/dashboard/profile/${user.username}`}
                    className="flex items-center gap-4 flex-1"
                  >
                    <div className="relative">
                      <img
                        src={user.user_img}
                        alt={user.username}
                        className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = defaultUser;
                        }}
                      />
                      {user.has_followed && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 hover:text-indigo-600">
                        {user.username}
                      </h3>
                      {user.first_name && user.last_name && (
                        <p className="text-sm text-gray-500">
                          {user.first_name} {user.last_name}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {user.has_followed ? "Following" : "Not following"}
                      </p>
                    </div>
                  </Link>
                  <Button
                    variant={user.has_followed ? "outline" : "default"}
                    className="rounded-full px-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFollow(user.username, user.has_followed);
                    }}
                    disabled={isFollowing[user.username]}
                  >
                    {isFollowing[user.username] ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : user.has_followed ? (
                      "Unfollow"
                    ) : (
                      "Follow"
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && searchResults.length === 0 && searchTerm && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-700">
              No users found
            </h3>
            <p className="mt-1 text-gray-500">
              Try searching for a different username
            </p>
          </div>
        )}
        {!isLoading && searchResults.length === 0 && !searchTerm && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-700">
              Search for users
            </h3>
            <p className="mt-1 text-gray-500">
              Enter a username to find people
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
