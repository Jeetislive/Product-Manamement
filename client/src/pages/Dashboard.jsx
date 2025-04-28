import React, { useEffect, useState } from 'react';
import {
  Box, Button, Grid, Typography, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useSnackbar } from 'notistack';
import { getAllProducts, deleteProduct, createProduct, updateProduct } from '../api/dataService'; // Add createProduct, updateProduct
import SidebarForm from '../components/SidebarForm';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('create'); // 'create' | 'edit' | 'view'
  const [selectedData, setSelectedData] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      console.log(data.data);
      
      const rows = data.data.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        description: item.description,
        category: item.category,
        image: item.image,
      }));
      setProducts(rows);
    } catch (err) {
      enqueueSnackbar('Failed to fetch products', { variant: 'error' });
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts(); // Fetch data from real API at mount
  }, []);

  const handleOpenDrawer = (mode, data = null) => {
    setDrawerMode(mode);
    setSelectedData(data);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setSelectedData(null);
  };

  const handleCreate = async (newProduct) => {
    try {
      await createProduct(newProduct); // Call backend API
      enqueueSnackbar('Product created successfully', { variant: 'success' });
      fetchProducts(); // Refresh the table after create
      handleCloseDrawer();
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to create product', { variant: 'error' });
    }
  };

  const handleUpdate = async (updatedProduct) => {
    try {
      await updateProduct(updatedProduct.id, updatedProduct); // Call backend API
      enqueueSnackbar('Product updated successfully', { variant: 'success' });
      fetchProducts(); // Refresh table after update
      handleCloseDrawer();
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to update product', { variant: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id); // Call backend API
      enqueueSnackbar('Product deleted successfully', { variant: 'info' });
      fetchProducts(); // Refresh after single delete
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to delete product', { variant: 'error' });
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(selectedRows.map((id) => deleteProduct(id))); // Delete all selected
      enqueueSnackbar('Selected products deleted successfully', { variant: 'info' });
      setSelectedRows([]);
      fetchProducts(); // Refresh after multiple delete
    } catch (err) {
      console.error(err);
      enqueueSnackbar('Failed to delete selected products', { variant: 'error' });
    }
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenImageModal(true);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 80, headerAlign: 'center', align: 'center' },
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <img
          src={params.value}
          alt={params.row.title}
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, cursor: 'pointer' }}
          onClick={() => handleImageClick(params.value)}
        />
      ),
    },
    { field: 'title', headerName: 'Title', width: 180, headerAlign: 'center', align: 'center' },
    { field: 'price', headerName: 'Price', width: 100, headerAlign: 'center', align: 'center' },
    { field: 'description', headerName: 'Description', width: 140, headerAlign: 'center', align: 'center' },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 260,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, mt: '10px' }}>
          <Button
            variant="outlined"
            color="info"
            size="small"
            onClick={() => handleOpenDrawer('view', params.row)}
          >
            View
          </Button>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleOpenDrawer('edit', params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ px: 2, py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Product Management
      </Typography>

      <Grid container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={() => handleOpenDrawer('create')}>
            Add Product
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteSelected}
            disabled={selectedRows.length === 0}
          >
            Delete Selected
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ width: '100%', maxWidth: 915 }}>
        <DataGrid
          rows={products}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          onRowSelectionModelChange={(newSelectionModel) => {
            setSelectedRows(newSelectionModel);
          }}
          disableSelectionOnClick={false}
          autoHeight
        />
      </Box>

      {/* Image Preview Dialog */}
      <Dialog open={openImageModal} onClose={() => setOpenImageModal(false)} maxWidth="md" fullWidth>
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src={selectedImage}
              alt="Large Preview"
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenImageModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sidebar Form */}
      <SidebarForm
        open={drawerOpen}
        mode={drawerMode}
        data={selectedData}
        onClose={handleCloseDrawer}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />
    </Box>
  );
};

export default Dashboard;
