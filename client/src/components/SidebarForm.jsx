import React, { useEffect, useState } from 'react';
import {
  Box,
  Drawer,
  Typography,
  TextField,
  Button,
  Stack,
} from '@mui/material';
import { uploadTempFile } from '../api/dataService';

const SidebarForm = ({ open, mode, data, onClose, onCreate, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (data && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: data.name || '',
        description: data.description || '',
        price: data.price || '',
        imageUrl: data.imageUrl || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
      });
    }
  }, [data, mode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    
    if (!file) return;
  
    setUploading(true);
  
    try {
      const res = await uploadTempFile(file); // <-- Use imported function
      setFormData((prev) => ({
        ...prev,
        imageUrl: res.data.imageUrl, // Returned temp S3 URL
      }));
      console.log(res.data);
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalProductData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl,
    };

    if (mode === 'create') {
      
      onCreate(finalProductData);
    } else if (mode === 'edit') {
      onUpdate({ ...finalProductData, id: data.id });
    }
  };

  const isViewMode = mode === 'view';

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 400, p: 3 }}>
        <Typography variant="h6" mb={2}>
          {mode === 'create' && 'Add Product'}
          {mode === 'edit' && 'Edit Product'}
          {mode === 'view' && 'View Product'}
        </Typography>

        <form onSubmit={handleSubmit}>
        <img
              src={formData.imageUrl}
              alt="Product"
              style={{ width: '50%', maxHeight: '120px', marginLeft: "100px" , objectFit: 'contain', marginBottom: '16px' }}
            />
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isViewMode}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={isViewMode}
              fullWidth
              multiline
              rows={3}
            />
            <TextField
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              disabled={isViewMode}
              fullWidth
            />

            {/* Upload Section */}
            {!isViewMode && (
              <>
                <Button variant="outlined" component="label" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload Image'}
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
              </>
            )}

            {/* Image Preview */}
            {formData.imageUrl && (
              <Box
                component="img"
                src={formData.imageUrl}
                alt="Uploaded"
                sx={{
                  width: '100%',
                  height: 200,
                  objectFit: 'contain',
                  mt: 2,
                  border: '1px solid #ccc',
                  borderRadius: 2,
                }}
              />
            )}

            {!isViewMode && (
              <Button type="submit" variant="contained" color="primary">
                {mode === 'create' ? 'Create' : 'Update'}
              </Button>
            )}
          </Stack>
        </form>
      </Box>
    </Drawer>
  );
};

export default SidebarForm;
