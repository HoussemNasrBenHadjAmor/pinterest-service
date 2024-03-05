import { useState } from "react";

import { Link } from "react-router-dom";

import { urlFor, client } from "../utils/sanity";

import Cookies from "universal-cookie";

import { v4 as uuidv4 } from "uuid";

import { DownloadIcon, LinkIcon, TrashIcon } from "@heroicons/react/outline";

const Pin = ({
  pin: { image, _id, destination, postedBy, save },
  setReload,
}) => {
  const cookies = new Cookies();

  const [postHover, setPostHover] = useState(false);

  const [loading, setLoading] = useState(false);

  const userId = cookies.get("id");

  const alreadySaved = !!save?.filter((item) => item?.userId === userId).length;

  const deletePost = (id) => {
    setReload(false);
    client.delete(id).then(() => setReload(true));
  };

  const saveOrUnsavePost = (id) => {
    setReload(false);
    if (!alreadySaved) {
      setLoading(true);
      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert("after", "save[-1]", [
          {
            _key: uuidv4(),
            userId,
            postedBy: {
              _type: "postedBy",
              _ref: userId,
            },
          },
        ])
        .commit()
        .then(() => {
          setLoading(false);
          setReload(true);
        });
    } else {
      const index = save?.map((item) => item.userId).indexOf(userId);
      client
        .patch(id)
        .splice("save", index, 1)
        .commit()
        .then(() => setReload(true));
    }
  };

  return (
    <Link to={`/pin-detail/${_id}`} className="space-y-2 cursor-zoom-in">
      <div
        className="relative"
        onMouseEnter={() => setPostHover(true)}
        onMouseLeave={() => setPostHover(false)}
      >
        <img
          src={urlFor(image).url()}
          alt="pin"
          className="rounded-lg w-full h-full object-cover"
        />

        <div
          className={`z-50 flex-initial md:${
            postHover ? "flex flex-col " : "hidden"
          }`}
        >
          <div className="absolute top-2 right-2">
            <button
              className="flex text-sm justify-center items-center p-2 text-white px-3 bg-red-500 opacity-70 rounded-3xl outline-none hover:opacity-100 hover:shadow-md"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                saveOrUnsavePost(_id);
              }}
            >
              {!alreadySaved && loading
                ? "Saving"
                : alreadySaved && !loading
                ? `${save?.length} Saved ✓`
                : `${save?.length ? save?.length : 0} Save(s)`}
            </button>
          </div>

          <div className="absolute top-2 left-2">
            <div className=" cursor-pointer flex justify-center items-center bg-gray-200 p-2 rounded-full hover:shadow-md">
              <a
                href={`${image?.asset?.url}?dl=`}
                download
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <DownloadIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {postedBy?._id === userId && (
            <div className="absolute bottom-2 right-2">
              <button
                className="cursor-pointer flex justify-center items-center p-2 bg-gray-200 rounded-full hover:shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deletePost(_id);
                }}
              >
                <TrashIcon className="w-5 h-5 object-cover" />
              </button>
            </div>
          )}

          {destination && (
            <div className="absolute bottom-2 left-2">
              <a
                onClick={(e) => {
                  e.stopPropagation();
                }}
                href={destination}
                target="_blank"
                rel="noreferrer"
                className="cursor-pointer gap-1 flex justify-center items-center bg-gray-200 p-2 pr-3 rounded-full"
              >
                <LinkIcon className="h-3 w-3" />
                <p className="text-xs">
                  {destination?.length > 20
                    ? destination?.slice(8, 20) + "..."
                    : destination}
                </p>
              </a>
            </div>
          )}
        </div>
      </div>
      <Link
        to={`/user-profile/${postedBy?._id}`}
        className="flex items-center gap-1 pb-5"
      >
        <img
          src={postedBy?.image}
          alt="user"
          className="w-8 h-8 rounded-full object-cover"
        />
        <p className="font-semibold">
          {postedBy?.userName?.length > 20
            ? postedBy?.userName?.slice(0, 20) + "..."
            : postedBy?.userName}
        </p>
      </Link>
    </Link>
  );
};

export default Pin;
