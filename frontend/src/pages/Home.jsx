import { useState, useEffect, useRef } from "react";

import { Link, Route, Routes } from "react-router-dom";

import Cookies from "universal-cookie";

import { client } from "../utils/sanity";

import { userQuery, categoryQuery } from "../utils/sanityCallApi";

import { Sidebar, UserProfile, ServerDown } from "../components";

import { Pins } from "./";

import { GiHamburgerMenu } from "react-icons/gi";

import { IoCloseOutline } from "react-icons/io5";

import { pLogo } from "../assets";

const Home = () => {
  const cookie = new Cookies();

  const id = cookie.get("user_id");

  const [toggleSideBar, setToggleSideBar] = useState(false);

  const [user, setUser] = useState(false);

  const [categories, setCategories] = useState(null);

  const [error, setError] = useState(false);

  const scrollRef = useRef();

  useEffect(() => {
    const query = userQuery(id);

    const catQuery = categoryQuery();

    Promise.all([
      client
        .fetch(query)
        .then((res) => setUser(res))
        .catch(() => setError(true)),

      client
        .fetch(catQuery)
        .then((res) => setCategories(res))
        .catch(() => setError(true)),
    ]);
  }, [id]);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  if (error) {
    return <ServerDown />;
  }

  return (
    <div className="flex flex-col md:flex-row transition-all duration-75 ease-in">
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} categories={categories} />
      </div>

      <div className="flex md:hidden justify-between items-center shadow-lg px-3 py-1">
        <GiHamburgerMenu
          fontSize={30}
          className="cursor-pointer"
          onClick={() => setToggleSideBar(true)}
        />
        <Link to="/">
          <img src={pLogo} className="w-24" alt="logo" />
        </Link>
        <Link to={`user-profile/${user?._id}`}>
          <img
            src={user?.image}
            className="w-10 h-10 rounded-full"
            alt="logo"
          />
        </Link>
      </div>

      {toggleSideBar && (
        <div className="w-4/5 fixed bg-white h-screen overflow-y-scroll scrollbar-hide shadow-2xl z-10">
          <div className="relative w-full flex justify-end items-center p-2">
            <IoCloseOutline
              fontSize={30}
              className="cursor-pointer"
              onClick={() => setToggleSideBar(false)}
            />
          </div>
          <Sidebar
            user={user && user}
            setToggleSideBar={setToggleSideBar}
            toggleSideBar={toggleSideBar}
            categories={categories}
          />
        </div>
      )}

      <div className="flex-1 pb-2 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route path="/user-profile/:id" element={<UserProfile />} />
          <Route
            path="/*"
            element={<Pins user={user && user} categories={categories} />}
          />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
