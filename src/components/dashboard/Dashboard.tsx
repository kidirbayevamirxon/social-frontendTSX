import { Link, useLocation } from "react-router-dom";
import home from "/house-solid.svg";
import profile from "/user-solid.svg";
import plus from "/circle-plus-solid.svg";
import search from "/magnifying-glass-solid.svg";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { getLocalStorageImage } from "@/utils/storageUtils";

function Dashboard() {
  const location = useLocation();
  const [userImage, setUserImage] = useState<string>(profile);
  useEffect(() => {
    const updateImage = () => {
      const img = getLocalStorageImage();
      setUserImage(img ? `${img}?t=${Date.now()}` : profile);
    };
    updateImage();
    const handleStorageChange = () => {
      updateImage();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
  const isActive = (path: string) => {
    return location.pathname.toLowerCase().includes(path.toLowerCase());
  };
  const navItems = [
    { path: "home", icon: home, label: "Home" },
    { path: "search", icon: search, label: "Search" },
    { path: "post", icon: plus, label: "Create" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-20 md:w-64 h-full bg-indigo-900 text-center p-4 md:p-6 flex flex-col transition-all duration-300">
        <div className="mb-10 md:mb-16">
          <h2 className="hidden md:block text-white text-2xl md:text-4xl font-bold">SocialApp</h2>
          <div className="md:hidden flex justify-center">
            <span className="text-white text-2xl font-bold">S</span>
          </div>
        </div>

        <div className="flex flex-col flex-grow justify-between">
          <div className="space-y-4 md:space-y-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-center md:justify-start gap-3 p-3 rounded-lg transition-colors ${
                  isActive(item.path) 
                    ? "bg-indigo-700 shadow-md" 
                    : "hover:bg-indigo-800"
                }`}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  className={`w-5 h-5 md:w-6 md:h-6 ${
                    isActive(item.path) ? "text-white" : "text-gray-300"
                  }`}
                  style={{
                    filter: isActive(item.path) 
                      ? "brightness(0) invert(1)" 
                      : "brightness(0) invert(0.8)"
                  }}
                />
                <span className="hidden md:block text-white text-lg md:text-xl">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
          <Link
            to="profile"
            className={`flex items-center justify-center md:justify-start gap-3 p-3 rounded-lg transition-colors ${
              isActive("profile") 
                ? "bg-indigo-700 shadow-md" 
                : "hover:bg-indigo-800"
            }`}
          >
            <div className="relative">
              <img
                src={userImage}
                alt="Profile"
                className="w-7 h-7 md:w-8 md:h-8 rounded-full object-cover border-2 border-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = profile;
                }}
              />
              {isActive("profile") && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-indigo-900"></div>
              )}
            </div>
            <span className="hidden md:block text-white text-lg md:text-xl">
              Profile
            </span>
          </Link>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;