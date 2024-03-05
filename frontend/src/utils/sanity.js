import sanityClient from "@sanity/client";

import imageUrlBuiler from "@sanity/image-url";

const config = {
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  apiVersion: "2022-03-25",
  dataset: process.env.REACT_APP_SANITY_DATASET,
  useCdn: false,
  token: process.env.REACT_APP_SANITY_TOKEN,
};

export const client = sanityClient(config);

const builer = imageUrlBuiler(client);

export const urlFor = (source) => builer.image(source);
