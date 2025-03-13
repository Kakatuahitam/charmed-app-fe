import React, { useState } from 'react';
import { useData } from 'vike-react/useData';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { Data } from './+data.js'

export default function Page() {
  const users = useData<Data>();

  // Datagrid stuffs
  const [selection, setSelection] = useState<GridSelectionModel>([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 200 },
    {
      field: 'firstName',
      headerName: 'First name',
      width: 250,
      editable: false,
    },
    {
      field: 'lastName',
      headerName: 'Last name',
      width: 250,
      editable: false,
    },
  ];

  const rows = users;

  // Set up data to send
  const [formData, setFormData] = useState({ firstName: '', lastName: '' });

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
          firstName: formData.firstName,
          lastName: formData.lastName
        })
      };

      const response = await fetch("http://localhost:3000/users", options);

      if (!response.ok) {
        throw new Error(`Failed to add user: ${response.statusText}`);
      }

      window.location.reload();
    } catch (error) {
      console.error('Error adding user:', error);
      alert('An error occurred while adding the user. Please try again.');
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

      const response = await fetch("http://localhost:3000/users", options);

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }

      window.location.reload();
    } catch (error) {
      console.error('Error deleting user(s):', error);
      alert('An error occurred while deleting the user. Please try again.');
    }
  }

  return (
    <>
      <h1>Members - Add Member</h1>
      <hr></hr>
      <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
        onSubmit={handleSubmit}
      >
        <TextField id="firstName" name="firstName" label="First Name" variant="filled"
          value={formData.firstName}
          onChange={handleChange}
        />
        <TextField id="lastName" name="lastName" label="Last Name" variant="filled"
          value={formData.lastName}
          onChange={handleChange}
        />
        <Button type="submit">Add Member</Button>
      </Box>

      <h1>Members - Manage</h1>
      <hr></hr>
      These are our Charmed Scout Member

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

      <Button type="submit"
        disabled={selectedRows >= 0}
        onClick={handleOpenDialog}
      >
        Delete
      </Button>
      {selectedRows.length} records

      <Dialog open={openDialog} onClose={handleCloseDialog}>
       <DialogTitle>Confirm Deletion</DialogTitle>
       <DialogContent>
         <p>Are you sure you want to delete this/these <strong>{selectedRows.length}</strong> member(s)?</p>
         <List>
          {selectedRows.map((id, index) => {
            const user = users.find((u) => u._id === id || u.id === id);
            return (
              <ListItem key={id}>
                <ListItemText primary={user ? `${index + 1}. ${user.firstName} ${user.lastName}` : "Unknown"} secondary={`ID: ${id}`} />
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
