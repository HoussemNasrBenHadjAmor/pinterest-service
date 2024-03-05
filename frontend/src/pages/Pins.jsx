import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import {
  Navbar,
  Feed,
  PinDetail,
  CreatePin,
  Search,
  NotFoundPage,
} from "../components";

const Pins = ({ user, categories }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const [clicked, setClicked] = useState(false);

  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          user={user && user}
          setClicked={setClicked}
        />
      </div>
      <div className="h-full">
        <Routes>
          <Route index element={<Feed />} />

          <Route path="/category/:categoryId" element={<Feed />} />

          <Route
            path="/pin-detail/:pinId"
            element={<PinDetail user={user && user} />}
          />
          <Route
            path="/create-pin"
            element={<CreatePin user={user && user} categories={categories} />}
          />
          <Route
            path="/search"
            element={<Search searchTerm={searchTerm} clicked={clicked} />}
          />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default Pins;
