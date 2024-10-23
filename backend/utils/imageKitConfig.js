import ImageKit from 'imagekit';

// const IMAGEKIT_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT.replace(
//   '<IMAGEKIT>',
//   process.env.IMAGE_KIT_ID
// );

// console.log(process.env.MONGODB_URL);

const imageKit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

export default imageKit;
