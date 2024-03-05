import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { FiSearch } from "react-icons/fi";

import { IoSend } from "react-icons/io5";

import { PlusIcon } from "@heroicons/react/solid";

const Navbar = ({ user, setSearchTerm, searchTerm, setClicked }) => {
  const navigate = useNavigate();

  const keyPress = (event) => {
    if (event.key === "Enter") {
      if (searchTerm !== "") {
        setClicked(true);
      }
    }
  };

  return (
    <div className="mt-5 mb-7 flex gap-2 md:gap-5 items-center">
      <div className="flex items-center w-full px-2 rounded-md border-none outline-none bg-white focus-within:shadow-md">
        <FiSearch fontSize={20} />

        <input
          type="text"
          className="p-3 w-full bg-white outline-none"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => {
            setClicked(false);
            setSearchTerm(e.target.value);
          }}
          onFocus={() => {
            setClicked(false);
            navigate("/search");
          }}
          onKeyDown={keyPress}
        />

        <IoSend
          fontSize={20}
          className="cursor-pointer mr-2"
          onClick={() => setClicked(true)}
        />
      </div>

      <div className="flex gap-3 justify-center items-center">
        <Link to={`user-profile/${user?._id}`} className="hidden md:flex">
          <img
            src={user?.image}
            alt="user-logo"
            className="w-14 h-12 rounded-full object-cover"
          />
        </Link>

        <Link
          to="create-pin"
          className="w-12 h-12 flex items-center justify-center bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 ease-in-out"
        >
          <PlusIcon className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
