export default {
  name: "comment",
  title: "Comment",
  type: "document",
  fields: [
    {
      name: "createdAt",
      title: "CreatedAt",
      type: "datetime",
    },
    {
      name: "postedBy",
      title: "PostedBy",
      type: "postedBy",
    },
    {
      name: "comment",
      title: "Comment",
      type: "string",
    },
  ],
};
