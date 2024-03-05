import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import Cookies from "universal-cookie";

const LoggedRoute = ({ children }) => {
  const cookies = new Cookies();

  const navigate = useNavigate();

  const id = cookies.get("user_id");

  useEffect(() => {
    if (id) {
      navigate("/", { replace: true });
    } else {
      cookies.remove("user_id", { path: "/" });
      navigate("/login", { replace: true });
    }
  }, [id]);

  return children;
};

export default LoggedRoute;
