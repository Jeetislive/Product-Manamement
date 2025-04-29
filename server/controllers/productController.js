import { Product } from '../models/product.js';
import { moveFile, deleteFile } from '../services/s3Service.js';

export const createProduct = async (request, res) => {
  const { name, price, description, category, imageUrl } = request.payload;
  // console.log("====>");
  const title = name;
  

  let finalImageUrl = imageUrl;
  if (imageUrl.includes('temp/')) {
    const oldKey = new URL(imageUrl).pathname.substring(1);
    const newKey = oldKey.replace('temp/', 'products/');
    console.log(oldKey,newKey);
    
    await moveFile(oldKey, newKey);

    finalImageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${newKey}`;
  }

  const product = await Product.create({
    title,
    price,
    description,
    category,
    image: finalImageUrl,
  });
  // console.log(product);
  

  return res.response(product).code(201);
};

export const getAllProducts = async (request, res) => {
  const products = await Product.findAll();
  return res.response(products).code(200);
};

export const getProductById = async (req,res) => {
  const { id } = request.params;
  const product = await Product.findByPk(id);
  return res.response(product).code(200);
}

export const deleteProduct = async (request, res) => {
  const { id } = request.params;
  const product = await Product.findByPk(id);
  if (!product) return res.response({ message: 'Not found' }).code(404);

  const imageUrl = product.image;
  const key = new URL(imageUrl).pathname.substring(1);

  await deleteFile(key);

  await product.destroy();

  return res.response({ message: 'Deleted' }).code(200);
};
