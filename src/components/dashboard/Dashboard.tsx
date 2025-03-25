import { Link } from "react-router-dom";
import home from "/house-solid.svg";
import profile from "/user-solid.svg";
import plus from "/circle-plus-solid.svg";
import search from "/magnifying-glass-solid.svg";
function Dashboard() {
  return (
    <>
      <div>
        <div className="w-[33%] h-[100vh] border-2 border-black ml-[-122px] bg-black text-center pt-25">
          <h2 className="text-amber-50 text-7xl font-bold mb-10">Logo</h2>
          <div className="flex flex-col gap-20 mt-20 items-center">
            {" "}
            <Link
              to={"/dashboard"}
              className="text-amber-50 text-4xl font-bold flex items-center gap-4"
            >
              <img src={home} alt="" className="w-[60px] h-14" />
              Home
            </Link>
            <Link
              to={"/profile"}
              className="text-amber-50 text-4xl font-bold flex items-center gap-4"
            >
              <img src={profile} alt="" className="w-[60px] h-14" />
              Profile
            </Link>
            <Link
              to={"/post"}
              className="text-amber-50 text-4xl font-bold flex items-center gap-4 ml-[-30px]"
            >
              <img src={plus} alt="" className="w-[60px] h-14" />
              Post
            </Link>
            <Link
              to={"/search"}
              className="text-amber-50 text-4xl font-bold flex items-center gap-4 ml-2"
            >
              <img src={search} alt="" className="w-[60px] h-14" />
              Search
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
