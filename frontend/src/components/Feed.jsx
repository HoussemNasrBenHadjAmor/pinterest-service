import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { client } from "../utils/sanity";
import { feedQuery, searchQuery } from "../utils/sanityCallApi";

import { Loader, MasonryLayout, ServerDown } from "./";

const Feed = () => {
  const [pins, setPins] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);

  const { categoryId } = useParams();

  const [reload, setReload] = useState(false);

  const ideaMessage = categoryId ? categoryId : "new";

  useEffect(() => {
    setLoading(true);
    if (categoryId) {
      const query = searchQuery(categoryId);
      client
        .fetch(query)
        .then((res) => {
          setPins(res);
          setLoading(false);
        })
        .catch(() => setError(true));
    } else {
      const query = feedQuery();
      client
        .fetch(query)
        .then((res) => {
          setPins(res);
          setLoading(false);
        })
        .catch(() => setError(true));
    }
  }, [categoryId, reload]);

  if (error) {
    return <ServerDown />;
  }

  if (loading) {
    return <Loader message={`Searching for ${ideaMessage} products!`} />;
  }

  if (pins?.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Sorry no product was found! </p>
      </div>
    );
  }

  return <MasonryLayout pins={pins && pins} setReload={setReload} />;
};

export default Feed;
