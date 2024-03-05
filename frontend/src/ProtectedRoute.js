import { useEffect, useState } from "react";

import { Navigate, useNavigate } from "react-router-dom";

import Cookies from "universal-cookie";

import { usersIdQuery } from "./utils/sanityCallApi";

import { client } from "./utils/sanity";

import { Loader, ServerDown } from "./components";

const ProtectedRoute = ({ children }) => {
  const cookies = new Cookies();

  const [loading, setLoading] = useState(null);

  const [logged, setLogged] = useState(null);

  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const id = cookies.get("user_id");

  const fetchData = () => {
    const query = usersIdQuery(id);
    client
      .fetch(query)
      .then((res) => {
        if (res?.length) {
          setLogged(true);
        } else {
          cookies.remove("user_id", { path: "/" });
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(() => {
    if (id) {
      fetchData();
      setLoading(true);
    } else {
      cookies.remove("user_id", { path: "/" });
      navigate("/login", { replace: true });
    }
  }, [id]);

  if (loading) {
    return <Loader height="h-screen" notShow />;
  }

  if (logged === null && loading === false) {
    return <Navigate to="login" />;
  }

  if (error) {
    return <ServerDown />;
  }

  return children;
};

export default ProtectedRoute;
