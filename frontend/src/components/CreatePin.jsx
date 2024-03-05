import { useState } from "react";
import { Link } from "react-router-dom";
import { client } from "../utils/sanity";
import { FileUploader } from "react-drag-drop-files";

import { ServerDown } from ".";
import { Oval } from "react-loader-spinner";

import { TrashIcon } from "@heroicons/react/outline";

const CreatePin = ({ categories, user }) => {
  const fileTypes = ["JPG", "PNG", "JPEG"];
  const fileds = [
    {
      name: "title",
      placeHolder: "Add your post title*",
    },
    {
      name: "description",
      placeHolder: "A little description about your post*",
    },
    {
      name: "destination",
      placeHolder: "Link for your image post",
    },
  ];

  const index = fileds.map((i) => i.name).indexOf("title", 0);
  const [file, setFile] = useState(null);
  const [data, setData] = useState({
    title: "",
    description: "",
    destination: "",
    category: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState(false);

  const Input = ({ name, placeHolder }) => (
    <>
      <input
        type="text"
        placeholder={placeHolder}
        className={`w-full p-2 outline-none border-b-2 border-slate-200 rounded-lg ${
          name === "title" && "lg:text-2xl lg:font-semibold"
        }`}
        name={name}
        onChange={(e) => changeData(e)}
        value={data[name]}
      />
      {index === 0 && name === "title" && (
        <Link
          to={`/user-profile/${user?._id}`}
          className="flex items-center gap-2 my-3"
        >
          <img
            src={user?.image}
            alt="user"
            className="w-10 h-10 rounded-full object-cover"
          />
          <p className="text-sm sm:text-base font-bold"> {user?.userName} </p>
        </Link>
      )}
    </>
  );

  const changeData = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const resetFields = () => {
    setData({
      ...data,
      category: "",
      description: "",
      destination: "",
      title: "",
    });
    setFile(null);
  };

  const uploadFile = (file) => {
    setUploadLoading(true);
    //uploading the image to sanity
    client.assets
      .upload("image", file, {
        contentType: file.type,
        filename: file.name,
      })
      .then((document) => {
        setFile(document);
        setUploadLoading(false);
      })
      .catch(() => {
        setError(true);
      });
  };

  const savePin = () => {
    if (
      data.title === "" ||
      data.description === "" ||
      !file?._id ||
      data.category === ""
    ) {
      setErrorMessage("Fields* And Image Are Required*");
    } else {
      setErrorMessage("");
      setLoading(true);
      const doc = {
        _type: "pin",
        title: data?.title,
        about: data?.description,
        destination: data?.destination,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: file?._id,
          },
        },
        userId: user?._id,
        postedBy: {
          _type: "postedBy",
          _ref: user?._id,
        },
        category: {
          _type: "category",
          _ref: data?.category,
        },
      };
      client
        .create(doc)
        .then(() => {
          setLoading(false);
          resetFields();
        })
        .catch(() => setError(true));
    }
  };

  if (error) {
    return <ServerDown />;
  }

  return (
    <div className="max-w-5xl mx-auto mt-5 mb-5">
      <div className="flex flex-col lg:flex-row lg:items-center bg-white p-3 shadow-xl">
        <div className="flex justify-center items-center mb-5 lg:mb-0">
          <div
            className={`${!file && "lg:bg-gray-200 p-2"} ${file && "relative"}
            w-full h-full lg:h-[400px] flex justify-center items-center`}
          >
            {!file && !uploadLoading ? (
              <FileUploader
                handleChange={uploadFile}
                name="file"
                types={fileTypes}
                multiple={false}
              />
            ) : uploadLoading && !file ? (
              <div className="w-full lg:w-[320px] flex justify-center items-center ">
                <Oval
                  height={50}
                  width={50}
                  color="rgb(14 116 144)"
                  secondaryColor="rgb(199 210 254)"
                />
              </div>
            ) : (
              <>
                <img
                  src={file?.url || file}
                  alt="uploaded"
                  className="w-full h-full rounded-lg"
                />

                <button className="items-center flex justify-center absolute bottom-3 right-3 bg-gray-200 rounded-full p-2 hover:shadow-md hover:bg-gray-300 transition-all duration-300 ease-in-out ">
                  <TrashIcon
                    className="h-5 w-5"
                    onClick={() => setFile(null)}
                  />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-5 lg:px-5">
          {/* {fileds.map(({ placeHolder, name }) => (
            <Input placeHolder={placeHolder} name={name} key={name} />
          ))} */}
          <input
            type="text"
            placeholder="Add your post title*"
            className={`w-full p-2 outline-none border-b-2 border-slate-200 rounded-lg lg:text-2xl lg:font-semibold
            `}
            name="title"
            onChange={(e) => changeData(e)}
            value={data.title}
          />
          <Link
            to={`/user-profile/${user?._id}`}
            className="flex items-center gap-2 my-3"
          >
            <img
              src={user?.image}
              alt="user"
              className="w-10 h-10 rounded-full object-cover"
            />
            <p className="text-sm sm:text-base font-bold"> {user?.userName} </p>
          </Link>
          <input
            type="text"
            placeholder="A little description about your post*"
            className={`w-full p-2 outline-none border-b-2 border-slate-200 rounded-lg `}
            name="description"
            onChange={(e) => changeData(e)}
            value={data.description}
          />{" "}
          <input
            type="text"
            placeholder="A Link for your image post"
            className={`w-full p-2 outline-none border-b-2 border-slate-200 rounded-lg `}
            name="destination"
            onChange={(e) => changeData(e)}
            value={data.destination}
          />
          {
            <select
              onChange={(e) => {
                changeData(e);
              }}
              className="outline-none w-full text-base border-b-2 border-gray-200 p-2 rounded-lg cursor-pointer"
              name="category"
            >
              <option value="">Select Category*</option>
              {categories?.map(({ title, _id }) => (
                <option
                  className="text-base border-0 outline-none capitalize bg-white text-black"
                  value={_id}
                  key={_id}
                >
                  {title}
                </option>
              ))}
            </select>
          }
          {errorMessage && errorMessage && (
            <p className="text-red-400"> {errorMessage} </p>
          )}
          <div className="flex items-center sm:justify-end gap-3">
            <button
              className="bg-red-500 p-2 px-5 rounded-xl text-white hover:bg-red-700 transition-all duration-300 ease-in-out"
              onClick={savePin}
            >
              {loading ? <Oval height={20} width={20} color="white" /> : "Save"}
            </button>
            <button
              className="bg-slate-700 p-2 px-5 rounded-xl text-white hover:bg-gray-900 transition-all duration-300 ease-in-out"
              onClick={resetFields}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
