import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex-col flex items-center justify-center h-screen space-y-2 text-center">
      <h1 className="text-6xl">404</h1>
      <h3 className="text-xl">
        The link is wrong or it has been deleted by the owner
      </h3>
      <h5 className="text-gray-400 text-xl">please check the link again...</h5>
    </div>
  );
};

export default NotFoundPage;
