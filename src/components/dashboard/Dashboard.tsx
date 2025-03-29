import { Link, useLocation } from "react-router-dom";
import home from "/house-solid.svg";
import profile from "/user-solid.svg";
import plus from "/circle-plus-solid.svg";
import search from "/magnifying-glass-solid.svg";
import { Outlet } from "react-router-dom";
import { userImg } from "../Profile/Profile";
function Dashboard() {
  const location = useLocation();
  // @ts-ignore
  const applyImageFilter = (imgPath: string) => {
    return {
      filter: "brightness(0) invert(1)",
      transition: "filter 0.3s ease",
      opacity: 0.9,
    };
  };

  const isActive = (path: string) => {
    const currentPath = location.pathname.toLowerCase();
    return currentPath.includes(path.toLowerCase());
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <div className="w-64 h-full bg-black text-center p-6 flex flex-col">
        <h2 className="text-amber-50 text-4xl font-bold mb-16">Logo</h2>

        <div className="flex flex-col flex-grow justify-between">
          <div className="space-y-8">
            <Link
              to="home"
              className={`flex items-center gap-4 p-3 rounded-lg ${
                isActive("/home") ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <img
                src={home}
                alt="Home"
                style={applyImageFilter(home)}
                className="w-6 h-6"
              />
              <span className="text-amber-50 text-xl">Home</span>
            </Link>

            <Link
              to="search"
              className={`flex items-center gap-4 p-3 rounded-lg ${
                isActive("/search") ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <img
                src={search}
                alt="Search"
                style={applyImageFilter(search)}
                className="w-6 h-6"
              />
              <span className="text-amber-50 text-xl">Search</span>
            </Link>

            <Link
              to="post"
              className={`flex items-center gap-4 p-3 rounded-lg ${
                isActive("/post") ? "bg-gray-800" : "hover:bg-gray-800"
              }`}
            >
              <img
                src={plus}
                alt="Post"
                style={applyImageFilter(plus)}
                className="w-6 h-6"
              />
              <span className="text-amber-50 text-xl">Post</span>
            </Link>
          </div>
          <Link
            to="profile"
            className={`flex items-center gap-4 p-3 rounded-lg ${
              isActive("/profile") ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <img
  src={userImg || profile}
  alt="Profile"
  style={applyImageFilter(userImg || profile)}
  className="w-7 h-7 rounded-2xl object-cover border border-gray-300"
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
