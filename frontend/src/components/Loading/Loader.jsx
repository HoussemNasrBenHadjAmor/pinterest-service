import { Oval } from "react-loader-spinner";

const Loader = ({ height, notShow, message }) => {
  const theHeight = height ? height : "h-screen";

  return (
    <div
      className={`${theHeight} items-center justify-start flex flex-col text-center`}
    >
      <div className="flex items-center justify-center h-screen">
        {notShow ? null : (
          <div className="flex flex-col items-center justify-center gap-3">
            {message && <p>{message} </p>}
            <Oval
              height={50}
              width={50}
              color="#00BFFF"
              secondaryColor="grey"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;
