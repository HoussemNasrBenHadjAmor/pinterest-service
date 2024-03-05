import { useState, useEffect } from "react";

import { client } from "../utils/sanity";
import { feedQuery, searchQuery } from "../utils/sanityCallApi";

import { MasonryLayout, ServerDown, Loader } from "./";

const Search = ({ searchTerm, clicked }) => {
  const [pins, setPins] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(false);

  const ideaMessage = searchTerm ? searchTerm : "new";

  useEffect(() => {
    if (searchTerm !== "") {
      if (clicked) {
        setLoading(true);
        const query = searchQuery(searchTerm.toLowerCase());
        client
          .fetch(query)
          .then((res) => {
            setPins(res);
            setLoading(false);
          })
          .catch(() => setError(true));
      }
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
  }, [searchTerm, clicked]);

  if (error) {
    return <ServerDown />;
  }

  if (loading) {
    return <Loader message={`Searching for ${ideaMessage} products!`} />;
  }

  if (!pins?.length) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Sorry no product was found! </p>
      </div>
    );
  }

  return <MasonryLayout pins={pins} />;
};

export default Search;
