export const usersIdQuery = (id) => {
  const query = `
    *[_type == "user" && profileID == "${id}"] {
        profileID
    }
    `;
  return query;
};

export const userQuery = (id) => {
  const query = `
  *[_type == 'user' && profileID =='${id}'] [0]
  `;
  return query;
};

export const userProfile = (id) => {
  const query = `
  *[_type == 'user' && _id =='${id}'] [0]
  `;
  return query;
};

export const categoryQuery = () => {
  const query = `*[_type == "category" ] {
    _id,
    slug,
    title,
    image {
    asset -> {
    url
  }
  }
  }`;
  return query;
};

export const feedQuery = () => {
  const query = `
  *[_type =="pin" ] |order(_createdAt desc){
    _id,
    image {
      asset->{
        url
      }
    },
    postedBy ->{
      _id,
      userName,
      image
    },
    destination,
    save[]{
      userId,
      postedBy ->{
        _id,
        userName,
        image
      }
    },
  }
  `;
  return query;
};

export const searchQuery = (searchTerm) => {
  const query = `
  *[_type=='pin' && (title match '${searchTerm}*' || category->title match '${searchTerm}*' || about match '${searchTerm}*')] |order(_createdAt desc){
     _id, 
    image {
        asset->{
          url
        }
      },
      postedBy ->{
        _id,
        userName,
        image
      },
      destination,
      save[]{
        userId,
        postedBy ->{
          _id,
          userName,
          image
        }
      },
  } 
  `;
  return query;
};

export const getDetailQuery = (id) => {
  const query = `
  *[_type=='pin' && _id=='${id}'][0]{
    _id,
    title,
    about,
    category->{
      slug
    },
    image {
         asset->{
           url
         }
       },
       postedBy ->{
         _id,
         userName,
         image
       },
       destination,
       save[]{
         _key,
         userId,
         postedBy ->{
           _id,
           userName,
           image
         }
       },
       comments [] {
        _ref , 
        comment,
        postedBy ->{
          _id,
          image,
          userName
        }
      }
   } `;

  return query;
};

export const moreQuery = (categorySlug, id) => {
  const query = `
  *[_type=='pin' && category->slug=='${categorySlug}'&& _id!= '${id}']{
    _id,
    image {
         asset->{
           url
         }
       },
       postedBy ->{
         _id,
         userName,
         image
       },
       destination,
       save[]{
         _key,
         userId,
         postedBy ->{
           _id,
           userName,
           image
         }
       },
      } 
  `;

  return query;
};

export const commentQuery = (id) => {
  const query = `
  *[_type=='pin'&& _id== '${id}'][0]
    {
          comments [] {
            createdAt,
            _key , 
            comment,
            postedBy ->{
              _id,
              image,
              userName
            }
          }
      } 
  `;

  return query;
};

export const createdPostQuery = (id) => {
  const query = `
  *[_type =="pin" && postedBy->_id == "${id}" ] | order(_createdAt desc){
    _id, 
     image {
         asset->{
           url
         }
       },
       postedBy ->{
         _id,
         userName,
         image
       },
       destination,
       save[]{
         userId,
         postedBy ->{
           _id,
           userName,
           image
         }
       },
 }

  `;
  return query;
};

export const savedPostQuery = (id) => {
  const query = `
  *[_type =="pin" && '${id}' in save[].userId] |order(_createdAt desc){
    _id, 
     image {
         asset->{
           url
         }
       },
       postedBy ->{
         _id,
         userName,
         image
       },
       destination,
       save[]{
         userId,
         postedBy ->{
           _id,
           userName,
           image
         }
       },
 }

  `;
  return query;
};
