import { Link, NavLink, useNavigate } from "react-router-dom";

import { urlFor } from "../utils/sanity";

import Cookies from "universal-cookie";

import { pLogo } from "../assets";

import { LogoutIcon } from "@heroicons/react/solid";

const isNotActiveStyle =
  "flex items-center gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
const isActiveStyle =
  "flex items-center gap-3 font-bold border-r-2 border-black transition-all duration-200 ease-in-out capitalize";

const Sidebar = ({ user, toggleSideBar, setToggleSideBar, categories }) => {
  const cookies = new Cookies();

  const navigate = useNavigate();

  const handleCloseSideBar = () => {
    if (toggleSideBar) {
      setToggleSideBar(false);
    }
  };

  const logout = () => {
    cookies.remove("user_id", { path: "/" });
    navigate("/login", { replace: "true" });
  };

  return (
    <div className="flex flex-col px-5 justify-between h-full w-full bg-white shadow-lg overflow-y-scroll scrollbar-hide">
      <div className="flex flex-col">
        <Link
          to="/"
          onClick={handleCloseSideBar}
          className="flex my-2 pt-1 items-center"
        >
          <img alt="logo" src={pLogo} className="w-24" />
        </Link>

        <div className="flex flex-col gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handleCloseSideBar}
          >
            Home
          </NavLink>

          <h3 className="mt-2 text-base 2xl:text-xl">Discover categories</h3>

          {categories?.map(({ slug, image, title }) => (
            <NavLink
              to={`category/${slug}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              onClick={handleCloseSideBar}
              key={`category-${slug}`}
            >
              <img
                src={urlFor(image?.asset?.url).url()}
                alt={`img-${title}`}
                className="w-8 h-8 rounded-full shadow-sm object-cover"
              />
              {title}
            </NavLink>
          ))}
        </div>

        {user && (
          <Link
            to={`user-profile/${user?._id}`}
            className="flex items-center gap-2 my-5 p-2 -mx-2 shadow-lg rounded-lg bg-white"
            onClick={handleCloseSideBar}
          >
            <img src={user.image} className="w-9 h-9 rounded-full" alt="user" />
            <p>{user.userName}</p>
          </Link>
        )}

        {user && (
          <div
            onClick={logout}
            className="flex items-center justify-center mt-2 mb-5 cursor-pointer bg-white p-2 rounded-lg hover:bg-black text-black hover:text-white transition-all duration-300 ease-in-out"
          >
            <div className="flex items-center justify-center gap-2">
              <p className="text-sm">Log Out </p>
              <LogoutIcon className="w-5 h-5 " />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
