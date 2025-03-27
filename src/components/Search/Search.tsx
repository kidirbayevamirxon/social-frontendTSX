import { Button } from "../ui/button";
import leftStrelka from "/arrow-left-solid.svg";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import search from "/magnifying-glass-solid.svg";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
interface UserSearchResult {
  username: string;
  user_type: string;
  has_followed: boolean;
}
function Search() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.get("/api/user/search", {
        params: { username: searchTerm },
      });
      setSearchResults(response.data);
      toast.success("Foydalanuvchi topildi");
    } catch (err) {
      setIsLoading(false);
      setSearchResults(null);

      if (axios.isAxiosError(err)) {
        if (err.response?.status === 422) {
          toast.error(err.response.data?.msg || "Noto'g'ri qidiruv ma'lumoti");
        } else {
          toast.error(err.message || "Foydalanuvchi qidirib topilmadi");
        }
      } else if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Noma'lum xato yuz berdi");
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="bg-black w-full h-screen overflow-hidden">
      <Button
        className="w-[80px] h-18 ml-[10%] mt-14"
        onClick={() => navigate("/dashboard")}
      >
        <img src={leftStrelka} alt="Back" className="w-xl h-15" />
      </Button>

      <div className="flex items-center justify-center gap-0">
        <Input
          className="w-[60%] h-[80px] border-r-o rounded-l-2xl rounded-r-none text-white !text-3xl p-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Foydalanuvchi nomini kiriting"
        />
        <Button
          className="flex p-2 pl-4 pr-4 border-white border-2 border-l-0 rounded-bl-none rounded-r-2xl h-[80px]"
          onClick={handleSearch}
          disabled={isLoading}
        >
          <img src={search} className="w-[60px]" alt="Search" />
        </Button>
      </div>

      {isLoading && (
        <div className="text-white text-center mt-8">Izlanyapti...</div>
      )}

      {searchResults && (
        <div className="mt-12 text-white flex flex-col items-center">
          <h2 className="text-2xl mb-6">Qidiruv Natijalari</h2>
          <div className="bg-gray-800 p-6 rounded-lg w-[60%]">
            <p>
              <strong>Foydalanuvchi nomi:</strong> {searchResults.username}
            </p>
            <p>
              <strong>Foydalanuvchi turi:</strong> {searchResults.user_type}
            </p>
            <p>
              <strong>Follow qilingan:</strong>{" "}
              {searchResults.has_followed ? "Followed" : "Follow"}
            </p>
          </div>
          
        </div>
      )}
    </div>
  );
}

export default Search;
