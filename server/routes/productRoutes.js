import { createProduct, getAllProducts, deleteProduct, getProductById } from '../controllers/productController.js';

export default [
  {
    method: 'POST',
    path: '/products',
    handler: createProduct,
  },
  {
    method: 'GET',
    path: '/products',
    handler: getAllProducts,
  },
  {
    method: 'GET',
    path: '/products/{id}',
    handler: getProductById,
  },
  {
    method: 'DELETE',
    path: '/products/{id}',
    handler: deleteProduct,
  },
];
