import { Button } from "../ui/button";
import user from "/user-solid (1).svg";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Mail, Users, UserPlus } from "lucide-react";
import { toast } from "react-hot-toast";
let userImg: string | null = null;

function Profile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    followers: 0,
    followings: 0,
    user_img: null as string | null
  });
  
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select an image first");
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

      if (response.status === 200) {
        toast.success("Profile picture updated successfully!");
        setUserData(prev => ({ ...prev, user_img: preview }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to update profile picture");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      navigate("/");
      return;
    }

    axios.get("https://social-backend-kzy5.onrender.com/auth/user", {
      headers: { Authorization: `Bearer ${token}` },
      params: { username }
    })
    .then(response => {
      const data = Array.isArray(response.data) ? response.data[0] : response.data;
      if (data) {
        setUserData({
          first_name: data.first_name || "Not set",
          last_name: data.last_name || "Not set",
          username: data.username || "Not set",
          email: data.email || "Not set",
          followers: data.followers || 0,
          followings: data.followings || 0,
          user_img: data.user_img || null
        });
      }
    })
    .catch(error => {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    });
  }, [navigate]);
  useEffect(() => {
    userImg = userData.user_img;
  }, [userData.user_img]);
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                <img
                  src={preview || userData.user_img || user}
                  alt="Profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <label className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <span className="text-white text-sm">Change</span>
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
                    <span>{userData.followers} Followers</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <UserPlus className="w-5 h-5 mr-2" />
                    <span>{userData.followings} Following</span>
                  </div>
                </div>
              </div>
            </div>
            {preview && (
              <div className="mt-6 flex flex-col items-center gap-4">
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setPreview(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleImageUpload}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Profile Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">First Name</h3>
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                {userData.first_name}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Last Name</h3>
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                {userData.last_name}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Username</h3>
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                @{userData.username}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Email</h3>
              <p className="text-gray-900 p-3 bg-gray-50 rounded-lg">
                {userData.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export { userImg };
export default Profile;
