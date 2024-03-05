import Masonry from "react-masonry-css";

import { Pin } from "./";

const MasonryLayout = ({ pins, setReload }) => {
  const breakpointColumnsObj = {
    default: 4,
    3000: 6,
    2000: 5,
    1200: 3,
    1000: 2,
    500: 1,
  };

  return (
    <Masonry className="flex gap-3" breakpointCols={breakpointColumnsObj}>
      {pins?.map((pin) => (
        <Pin pin={pin} key={`pin-${pin._id}`} setReload={setReload} />
      ))}
    </Masonry>
  );
};

export default MasonryLayout;
