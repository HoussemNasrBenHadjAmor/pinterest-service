import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Moment from "react-moment";

import { v4 as uuid } from "uuid";

import { urlFor, client } from "../utils/sanity";

import {
  getDetailQuery,
  moreQuery,
  commentQuery,
} from "../utils/sanityCallApi";

import { Loader, ServerDown, MasonryLayout } from "./";

import { DownloadIcon, TrashIcon } from "@heroicons/react/outline";

import { Oval } from "react-loader-spinner";

const PinDetail = ({ user }) => {
  const [more, setMore] = useState(null);
  const [pin, setPin] = useState(null);
  const [comments, setComments] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const { pinId } = useParams();

  const SingleComment = ({
    comment: { _key, comment, postedBy, createdAt },
  }) => (
    <div className="flex items-center gap-2 my-3 mx-2">
      <Link
        to={`/user-profile/${postedBy?._id}`}
        className="flex flex-wrap items-center mb-3"
      >
        <img
          src={postedBy?.image}
          alt="me"
          className="h-9 w-9 rounded-full object-cover"
        />
      </Link>

      <div className="flex-1 space-y-1">
        <div className="shadow-md rounded-2xl p-2 ">
          <Link
            to={`/user-profile/${postedBy?._id}`}
            className="text-xs font-semibold hover:underline transition-all duration-300 ease-in-out"
          >
            {postedBy?.userName}
          </Link>
          <p className="text-xs text-gray-500 font-semibold">{comment}</p>
        </div>
        <div className="flex justify-between items-center pr-1">
          <p className="text-xs text-gray-300">
            <Moment date={createdAt} fromNow />
          </p>
          {postedBy?._id === user._id && (
            <TrashIcon
              className="h-4 w-4 cursor-pointer"
              onClick={() => removeComment(_key)}
            />
          )}
        </div>
      </div>
    </div>
  );

  const removeComment = (_key) => {
    const index = comments?.map((object) => object._key).indexOf(_key);

    client
      .patch(pinId)
      .splice("comments", index, 1)
      .commit()
      .then(() => fetchComments())
      .catch(() => setError(true));
  };

  const addComment = () => {
    setSending(true);
    client
      .patch(pinId)
      .setIfMissing({ comments: [] })
      .insert("after", "comments[-1]", [
        {
          _key: uuid(),
          comment,
          postedBy: {
            _type: "postedBy",
            _ref: user?._id,
          },
          createdAt: new Date(),
        },
      ])
      .commit()
      .then(() => {
        setComment("");
        setSending(false);
        fetchComments();
      })
      .catch(() => setError(true));
  };

  const fetchComments = () => {
    const query = commentQuery(pinId);
    client
      .fetch(query)
      .then((res) => setComments(res?.comments))
      .catch(() => setError(true));
  };

  const fetchDetail = () => {
    setLoading(true);
    const query = getDetailQuery(pinId);
    client
      .fetch(query)
      .then((res) => {
        if (res) {
          setPin(res);
          const query = moreQuery(res?.category?.slug, pinId);
          client
            .fetch(query)
            .then((data) => {
              setMore(data);
              setLoading(false);
            })
            .catch(() => setError(true));
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  };

  useEffect(() => {
    fetchComments();
    fetchDetail();
  }, [pinId]);

  if (error) {
    return <ServerDown />;
  }

  if (loading) {
    return <Loader message="Fetching pin's detail..." />;
  }

  return (
    <>
      <div className="max-w-5xl mx-auto mt-5 mb-5">
        <div className="flex flex-col md:flex-row rounded-2xl bg-white shadow-xl gap-3">
          <div className="flex justify-center items-center">
            <img
              src={pin && urlFor(pin?.image).url()}
              alt="pin"
              className="h-full w-full object-cover md:rounded-tl-2xl md:rounded-bl-2xl"
            />
          </div>

          <div className="w-full flex-1 p-5 gap-3">
            <div className="flex items-center justify-between">
              <div className="cursor-pointer flex justify-center items-center bg-gray-200 p-2 rounded-full hover:shadow-md">
                <a
                  href={`${pin?.image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <DownloadIcon className="h-5 w-5" />
                </a>
              </div>

              <a
                href={pin?.destination}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
              >
                {pin?.destination?.length > 20
                  ? pin?.destination?.slice(8, 20)
                  : pin?.destination}
              </a>
            </div>

            <div className="my-5 gap-2 flex flex-col">
              <h1 className="text-2xl font-semibold">{pin?.title}</h1>
              <p className="text-xs text-gray-500">{pin?.about}</p>
            </div>

            <Link
              to={`/user-profile/${pin?.postedBy?._id}`}
              className="flex items-center gap-2"
            >
              <img
                src={pin?.postedBy?.image}
                alt="posbtedBy"
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="text-sm font-bold">{pin?.postedBy?.userName}</p>
            </Link>

            <div className="my-5 flex flex-col">
              <h1 className="text-xl font-semibold">Comments</h1>
            </div>

            {comments && (
              <div className="overflow-y-auto h-40 mb-8">
                {comments?.map((comment) => (
                  <SingleComment key={comment._key} comment={comment} />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <Link to={`/user-profile/${user._id}`} className="">
                <img
                  src={user?.image}
                  alt="me"
                  className="h-10 w-10 rounded-full object-cover"
                />
              </Link>

              <textarea
                rows={1}
                placeholder="Add a comment"
                className="resize-none p-2 rounded-2xl flex-1 outline-none border-2 border-gray-200"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                className={`p-2 bg-red-500 hover:bg-red-700 text-white rounded-full px-5 transition-all duration-300 ease-in-out ${
                  !comment.length ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                onClick={addComment}
                disabled={!comment.length}
              >
                {sending ? (
                  <div className="flex gap-1 justify-center items-center">
                    <Oval
                      height={15}
                      width={15}
                      color="white"
                      secondaryColor="white"
                    />
                  </div>
                ) : (
                  "Send"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {more?.length > 0 && (
        <div className="space-y-14 mt-10">
          <h1 className="text-lg md:text-2xl text-center font-bold mt-8">
            More Like This
          </h1>

          <MasonryLayout pins={more} />
        </div>
      )}
    </>
  );
};

export default PinDetail;
