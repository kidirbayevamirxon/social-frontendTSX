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

  // Rasmni yuklash va yangilash
  useEffect(() => {
    const updateImage = () => {
      const img = getLocalStorageImage();
      setUserImage(img ? `${img}?t=${Date.now()}` : profile);
    };

    // Dastlabki yuklash
    updateImage();

    // Storage o'zgarishlarini kuzatish
    const handleStorageChange = () => {
      updateImage();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Icon filter style
  const applyImageFilter = (isActive: boolean) => {
    return isActive
      ? {}
      : {
          filter: "brightness(0) invert(1)",
          transition: "filter 0.3s ease",
          opacity: 0.9,
        };
  };

  // Aktiv linkni aniqlash
  const isActive = (path: string) => {
    return location.pathname.toLowerCase().includes(path.toLowerCase());
  };

  // Navigation items
  const navItems = [
    { path: "home", icon: home, label: "Home" },
    { path: "search", icon: search, label: "Search" },
    { path: "post", icon: plus, label: "Post" },
  ];

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="w-64 h-full bg-black text-center p-6 flex flex-col">
        <h2 className="text-amber-50 text-4xl font-bold mb-16">Logo</h2>

        <div className="flex flex-col flex-grow justify-between">
          <div className="space-y-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 p-3 rounded-lg ${
                  isActive(item.path) ? "bg-gray-800" : "hover:bg-gray-800"
                }`}
              >
                <img
                  src={item.icon}
                  alt={item.label}
                  style={applyImageFilter(isActive(item.path))}
                  className="w-6 h-6"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                <span className="text-amber-50 text-xl">{item.label}</span>
              </Link>
            ))}
          </div>

          <Link
            to="profile"
            className={`flex items-center gap-4 p-3 rounded-lg ${
              isActive("profile") ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <img
              src={userImage}
              alt="Profile"
              style={applyImageFilter(isActive("profile"))}
              className="w-7 h-7 rounded-2xl object-cover border border-gray-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = profile;
              }}
            />
            <span className="text-amber-50 text-xl">Profile</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-900 p-6">
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
