import React, { useEffect, useState } from 'react';
import {
  DataGridPro,
  GridActionsCellItem,
} from '@mui/x-data-grid-pro';
import {
  Box,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';

import {
  getAllProducts,
  deleteProduct,
} from '../api/dataService';

const DataTable = ({ onEdit, onView, onCreate }) => {
  const [rows, setRows] = useState([]);
  const [selectionModel, setSelectionModel] = useState([]);

  const fetchData = async () => {
    try {
      const res = await getAllProducts();
      setRows(res.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    fetchData();
  };

  const handleBulkDelete = async () => {
    await Promise.all(selectionModel.map((id) => deleteProduct(id)));
    fetchData();
    setSelectionModel([]);
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'title', headerName: 'Title', width: 200 },
    { field: 'price', headerName: 'Price', width: 100 },
    { field: 'category', headerName: 'Category', width: 150 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<VisibilityIcon />}
          label="View"
          onClick={() => onView(params.row)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => onEdit(params.row)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDelete(params.row.id)}
          showInMenu
        />,
      ],
    },
  ];

  return (
    <Box p={2}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Product List</Typography>
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreate}
          >
            Add Product
          </Button>
          {selectionModel.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleBulkDelete}
            >
              Delete Selected
            </Button>
          )}
        </Stack>
      </Stack>

      <DataGridPro
        rows={rows}
        columns={columns}
        checkboxSelection
        disableRowSelectionOnClick
        autoHeight
        getRowId={(row) => row.id}
        onRowSelectionModelChange={(ids) =>
          setSelectionModel(ids)
        }
        rowSelectionModel={selectionModel}
      />
    </Box>
  );
};

export default DataTable;
