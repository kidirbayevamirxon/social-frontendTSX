import { Button } from "../ui/button";
import user from "/user-solid (1).svg";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Mail, Users, UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "../Modal/Modal";
import settings from "/gear-solid.svg";
import { useTranslation } from "react-i18next";

import {
  getLocalStorageImage,
  setLocalStorageImage,
  isValidHttpUrl,
} from "../../utils/storageUtils";

function Profile() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(() => {
    const initialImg = getLocalStorageImage();
    return {
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      followers: 0,
      followings: 0,
      user_img: initialImg || user,
    };
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const changeLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };
  const getSafeImageUrl = (imgUrl: string | null): string => {
    if (preview) return preview;
    if (!imgUrl) return user;
    return `${imgUrl}${imgUrl.includes("?") ? "&" : "?"}t=${Date.now()}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error("Iltimos, avval rasm tanlang");
      return;
    }
    if (!isValidImage(selectedFile)) {
      toast.error(
        "Iltimos, 5MB dan kichik va JPEG/PNG formatidagi rasm tanlang"
      );
      return;
    }
    const formData = new FormData();
    formData.append("file", selectedFile);
    setLoading(true);
    try {
      const response = await axios.post(
        "https://social-backend-kzy5.onrender.com/image/user",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      localStorage.setItem("userImage", response.data.user_image);

      if (response.status === 200 && response.data.image_url) {
        const newImageUrl = response.data.image_url;
        if (!isValidHttpUrl(newImageUrl)) {
          throw new Error("Noto‘g‘ri rasm URLi qaytarildi");
        }
        setLocalStorageImage(newImageUrl);
        setUserData((prev) => ({ ...prev, user_img: newImageUrl }));
        setPreview(null);
        toast.success("Profil rasmi muvaffaqiyatli yangilandi!");
      }
    } catch (error) {
      console.error("Rasm yuklashda xato:", error);
      toast.error("Rasm yuklash muvaffaqiyatsiz");
    } finally {
      setLoading(false);
    }
  };

  const isValidImage = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024;
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      navigate("/");
      return;
    }

    axios
      .get("https://social-backend-kzy5.onrender.com/auth/user", {
        headers: { Authorization: `Bearer ${token}` },
        params: { username },
      })
      .then((response) => {
        const data = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        if (data) {
          const storedImg = getLocalStorageImage();
          const imgUrl =
            data.user_img && isValidHttpUrl(data.user_img)
              ? data.user_img
              : storedImg || user;

          setUserData({
            first_name: data.first_name || "Not set",
            last_name: data.last_name || "Not set",
            username: data.username || "Not set",
            email: data.email || "Not set",
            followers: data.followers || 0,
            followings: data.followings || 0,
            user_img: imgUrl,
          });

          if (data.user_img && isValidHttpUrl(data.user_img)) {
            setLocalStorageImage(data.user_img);
          }
        }
      })
      .catch((error) => {
        console.error("Foydalanuvchi ma'lumotlarini olishda xato:", error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          toast.error("Tizimga qayta kiring!");
          navigate("/");
        } else {
          toast.error("Foydalanuvchi ma'lumotlarini yuklab bo'lmadi");
        }
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <img
                  src={getSafeImageUrl(userData.user_img || user)}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = user;
                  }}
                />
                <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <span className="text-white text-sm">{t("change")}</span>
                </label>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-800">
                  {userData.first_name} {userData.last_name}
                </h1>
                <p className="text-gray-600 mt-1">@{userData.username}</p>
                <p className="text-gray-500 mt-2 flex items-center justify-center md:justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  {userData.email}
                </p>
                <div className="flex gap-6 mt-4 justify-center md:justify-start">
                  <div className="flex items-center text-gray-700">
                    <Users className="w-5 h-5 mr-2" />
                    <span>
                      {userData.followers} {t("followers")}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <UserPlus className="w-5 h-5 mr-2" />
                    <span>
                      {userData.followings} {t("followingPr")}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-[-109px] right-4 z-50">
                {!isOpen && (
                  <button
                    className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={() => setIsOpen(true)}
                    aria-label="Settings"
                  >
                    <img
                      src={settings}
                      alt="Settings"
                      className="w-6 h-6 text-gray-700"
                    />
                  </button>
                )}
              </div>
            </div>
            {preview && (
              <div className="mt-6 flex flex-col items-center gap-4">
                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setPreview(null)}>
                    {t("cancel")}
                  </Button>
                  <Button
                    onClick={handleImageUpload}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    {t("save_changes")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {t("profile_info")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {t("first_name")}
              </h3>
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                {userData.first_name}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {t("last_name")}
              </h3>
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                {userData.last_name}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {t("username")}
              </h3>
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                @{userData.username}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                {t("email")}
              </h3>
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                {userData.email}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={isOpen}
        setOpen={setIsOpen}
        className="max-w-md w-full p-6 rounded-lg"
      >
        <div className="space-y-4">
          <h2 className="text-center text-2xl font-bold text-gray-800 mb-6">
            {t("select_language")}
          </h2>

          <div className="relative">
            <select
              onChange={changeLanguage}
              value={i18n.language}
              className="block w-full px-4 py-3 pr-8 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
            >
              <option value="uz" className="py-2">
                O'zbekcha
              </option>
              <option value="en" className="py-2">
                English
              </option>
              <option value="ru" className="py-2">
                Русский
              </option>
              <option value="qr" className="py-2">
                Qaraqalpaq
              </option>
              <option value="xt" className="py-2">
                Xitoy
              </option>
              <option value="ge" className="py-2">
                Germany
              </option>
              <option value="kk" className="py-2">
                Qozoqcha
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              {t("close")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
export default Profile;
