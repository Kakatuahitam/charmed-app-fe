import React, { useState } from 'react';
import { useData } from 'vike-react/useData';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, InputLabel, List, ListItem, ListItemText, MenuItem, Select
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { Data } from './+data.js'

export default function Page() {
  const groups = useData<Data>();

  // Datagrid stuffs
  const [selection, setSelection] = useState<GridSelectionModel>([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', },
    {
      field: 'name',
      headerName: 'Nama Kelompok',
      width: 160,
      editable: false,
    },
    {
      field: 'type',
      headerName: 'Jenis Kelompok',
      width: 120,
      editable: false,
    },
    {
      field: 'memberCount',
      headerName: 'Jumlah Anggota',
      width: 80,
      editable: false,
    },
  ];

  const rows = groups;

  // Set up data to send
  const [formData, setFormData] = useState({ name: '', type: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          type: formData.type
        })
      };

      const response = await fetch("http://localhost:3000/groups", options);

      if (!response.ok) {
        throw new Error(`Failed to add group: ${response.statusText}`);
      }

      window.location.reload();
    } catch (error) {
      console.error('Error adding group:', error);
      alert('An error occurred while adding the group. Please try again.');
    }
  };

  // Delete stuffs
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    if (selectedRows.length === 0) {
      alert("No rows selected!");
      return;
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    const deleteRows = selectedRows

    try {
      const options = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: deleteRows
        })
      };

      const response = await fetch("http://localhost:3000/groups", options);

      if (!response.ok) {
        throw new Error(`Failed to delete group: ${response.statusText}`);
      }

      window.location.reload();
    } catch (error) {
      console.error('Error deleting group(s):', error);
      alert('An error occurred while deleting the group. Please try again.');
    }
  }

  return (
    <>
      <h1>Groups - View Groups</h1>
      <hr></hr>

      <h3>Actions</h3>
      <p>No current action available this time</p>
      {/* <Button type="submit"
        disabled={selectedRows >= 0}
        onClick={handleOpenDialog}
        variant="contained"
      >
        Delete
      </Button>
      {selectedRows.length} records */}

      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 16,
              },
            },
          }}
          pageSizeOptions={[5, 16]}
          checkboxSelection
          disableRowSelectionOnClick
          onRowSelectionModelChange={(e) => {
            setSelectedRows(e);
          }}
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
       <DialogTitle>Confirm Deletion</DialogTitle>
       <DialogContent>
         <p>Are you sure you want to delete this/these <strong>{selectedRows.length}</strong> member(s)?</p>
         <List>
          {selectedRows.map((id, index) => {
            const group = groups.find((u) => u._id === id || u.id === id);
            return (
              <ListItem key={id}>
                <ListItemText primary={group ? `${index + 1}. ${group.name} ${group.type}` : "Unknown"} secondary={`ID: ${id}`} />
              </ListItem>
            );
          })}
        </List>

       </DialogContent>
       <DialogActions>
         <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
         <Button onClick={handleDelete} color="error">Confirm Delete</Button>
       </DialogActions>
     </Dialog>
    </>
  );
}
