import cloudinary from '../config/cloudinary.js';

export const uploadImage = async (filePath) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'ecommerce/products',
  });
  return result.secure_url;
};

export const uploadImageFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'ecommerce/products', resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

export const uploadMultipleFromBuffer = async (buffers) => {
  const uploads = buffers.map((buf) => uploadImageFromBuffer(buf));
  return Promise.all(uploads);
};

export const deleteImage = async (publicId) => {
  return cloudinary.uploader.destroy(publicId);
};
