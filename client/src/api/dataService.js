import axiosInstance from './axiosInstance';

// 📦 Products APIs
export const getAllProducts = () => {
  return axiosInstance.get('/products');
};

export const getProductById = (id) => {
  return axiosInstance.get(`/products/${id}`);
};

export const createProduct = (product) => {
  console.log(product);
  
  return axiosInstance.post('/products', product);
};

export const updateProduct = (id, product) => {
  return axiosInstance.put(`/products/${id}`, product);
};

export const deleteProduct = (id) => {
  return axiosInstance.delete(`/products/${id}`);
};

// 📷 Temp File Upload API (New added)
export const uploadTempFile = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  // ✅ Proper way to see formData contents
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return axiosInstance.post('/upload-temp', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

