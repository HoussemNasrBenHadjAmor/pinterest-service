import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import { client } from "../utils/sanity";

import {
  savedPostQuery,
  createdPostQuery,
  userProfile,
} from "../utils/sanityCallApi";

import { Loader, ServerDown, MasonryLayout, Pin } from ".";

const UserProfile = () => {
  const { id } = useParams();
  const imageSoure =
    "https://source.unsplash.com/1600x900/?nature,photography,technology";

  const [createdPost, setCreatedPost] = useState(null);
  const [savedPost, setSavedPost] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reload, setReload] = useState(false);

  const Button = ({ title, active }) => (
    <button
      className={`p-2 px-5 ${
        active ? "bg-red-500" : "white"
      } text-xs md:text-base ${
        active ? "text-white" : "black"
      } transition-all duration-300 ease-out rounded-3xl font-bold`}
      onClick={() => setSaved(!saved)}
    >
      {title}
    </button>
  );

  useEffect(() => {
    const createdQuery = createdPostQuery(id);
    const savedQuery = savedPostQuery(id);
    const queryUser = userProfile(id);
    setLoading(true);
    Promise.all([
      client.fetch(createdQuery),
      client.fetch(savedQuery),
      client.fetch(queryUser),
    ])
      .then((res) => {
        setCreatedPost(res[0]);
        setSavedPost(res[1]);
        setUser(res[2]);
        setLoading(false);
      })
      .catch(() => setError(true));
  }, [id, reload]);

  if (loading) {
    return <Loader message="Fetching user profile..." />;
  }

  if (error || !user) {
    return <ServerDown />;
  }

  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="w-full">
          <img
            src={imageSoure}
            alt="cover"
            className="w-full h-48 md:h-64 2xl:h-80 object-cover shadow-xl"
          />

          <div className="-mt-14 flex flex-col justify-center items-center gap-3">
            <img
              src={user?.image}
              alt="profile-user"
              className="w-15 h-15 object-cover rounded-full shadow-xl"
            />
            <p className="text-md md:text-xl font-bold">{user?.userName}</p>
          </div>
        </div>

        <div className="flex space-x-2 my-8">
          <Button title="Created" active={!saved} />
          <Button title="Saved" active={saved} />
        </div>
      </div>

      <div className="px-2 md:px-5 mt-3">
        {!saved && <MasonryLayout pins={createdPost} setReload={setReload} />}
        {saved && <MasonryLayout pins={savedPost} setReload={setReload} />}
        {!saved && !createdPost?.length && (
          <p className="text-center mt-16">
            Sorry no post is saved! Save a post and u'll find it here!
          </p>
        )}
        {saved && !savedPost?.length && (
          <p className="text-center mt-16">
            Sorry no post is created! It's time to start creating posts!
          </p>
        )}
      </div>
    </>
  );
};

export default UserProfile;
