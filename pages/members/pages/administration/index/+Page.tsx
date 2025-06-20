import React, { useState } from 'react';
import { useData } from 'vike-react/useData';
import {
  Chip,Dialog, DialogActions, DialogContent, DialogTitle, InputLabel,
  List, ListItem, ListItemText,
  MenuItem, Select
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import type { Data } from './+data.js'

export default function Page() {
  const { users, groups } = useData<Data>();

  // Datagrid stuffs
  const [selection, setSelection] = useState<GridSelectionModel>([]);
  const [selectedRows, setSelectedRows] = useState([]);

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 120},
    {
      field: 'groupName',
      headerName: 'Kelompok',
      width: 100,
      editable: false,
    },
    {
      field: 'fullname',
      headerName: 'Fullname',
      width: 250,
      editable: false,
    },
    {
      field: 'nickname',
      headerName: 'Nickname',
      width: 100,
      editable: false,
    },
    {
      field: 'sex',
      headerName: 'L/P',
      width: 100,
      editable: false,
    },
    {
      field: 'religion',
      headerName: 'Agama',
      width: 100,
      editable: false,
    },
    {
      field: 'golongan',
      headerName: 'Golongan',
      width: 120,
      editable: false,
    },
    {
      field: 'tingkatan',
      headerName: 'Tingkatan',
      width: 120,
      editable: false,
    },
  ];

  const rows = users;

  // Set up data to send
  const [formData, setFormData] = useState({
    fullname: '', nickname: '', parentName: '', sex: '',
    religion: '', groupID: '', golongan:'', tingkatan: ''});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "golongan" ? { tingkatan: "" } : {}) // Reset tingkatan only when changing golongan
    }));
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
          fullname: formData.fullname,
          nickname: formData.nickname,
          groupID: formData.groupID,
          parentName: formData.parentName,
          sex: formData.sex,
          religion: formData.religion,
          golongan: formData.golongan,
          tingkatan: formData.tingkatan,
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

  const labelColors = {
    // Siaga (Green)
    1: "#4CAF50",  // Mula
    2: "#4CAF50",  // Bantu
    3: "#4CAF50",  // Tata
    4: "#4CAF50",  // Garuda (Siaga)

    // Penggalang (Red)
    5: "#F44336",  // Ramu
    6: "#F44336",  // Rakit
    7: "#F44336",  // Terap
    8: "#F44336",  // Garuda (Penggalang)

    // Penegak (Yellow)
    9: "#FFEB3B",  // Bantara
    10: "#FFEB3B", // Laksana
    11: "#FFEB3B", // Garuda (Penegak)

    // Pandega (Brown)
    12: "#795548", // Pandega
    13: "#795548"  // Garuda (Pandega)
  };

  const tingkatanOptions = {
    1: [1, 2, 3, 4],       // Siaga → Mula, Bantu, Tata, Garuda (S)
    2: [5, 6, 7, 8],       // Penggalang → Ramu, Rakit, Terap, Garuda (G)
    3: [9, 10, 11],        // Penegak → Bantara, Laksana, Garuda (T)
    4: [12, 13]           // Pandega → Pandega, Garuda (D)
  };

  const tingkatanLabels = {
    1: "Mula",
    2: "Bantu",
    3: "Tata",
    4: "Garuda (S)",
    5: "Ramu",
    6: "Rakit",
    7: "Terap",
    8: "Garuda (G)",
    9: "Bantara",
    10: "Laksana",
    11: "Garuda (T)",
    12: "Pandega",
    13: "Garuda (D)"
  };


  return (
    <>
      <h1>Members - Add Member</h1>
      <hr></hr>

      <Box
        component="form"
        sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
        onSubmit={handleSubmit}
      >
        <TextField
          id="fullname"
          name="fullname"
          label="Nama Lengkap"
          variant="filled"
          value={formData.fullname}
          onChange={handleChange}
        />
        <TextField
          id="nickname"
          name="nickname"
          label="Nama Panggil"
          variant="filled"
          value={formData.nickname}
          onChange={handleChange}
        />
        <TextField
          id="parentName"
          name="parentName"
          label="Nama Orang Tua"
          variant="filled"
          value={formData.parentName}
          onChange={handleChange}
        />

        <TextField
          id="sex" name="sex"
          value={formData.sex} onChange={handleChange} select label="Jenis Kelamin"
        >
          <MenuItem value={1}>Laki-laki</MenuItem>
          <MenuItem value={2}>Perempuan</MenuItem>
        </TextField>

        <TextField
          id="religion" name="religion"
          value={formData.religion} onChange={handleChange} select label="Agama"
        >
          <MenuItem value={1}>Islam</MenuItem>
          <MenuItem value={2}>Kristen</MenuItem>
          <MenuItem value={3}>Katolik</MenuItem>
          <MenuItem value={4}>Hindu</MenuItem>
          <MenuItem value={5}>Budha</MenuItem>
          <MenuItem value={6}>Konghucu</MenuItem>
        </TextField>

        <TextField
          id="groupID" name="groupID"
          value={formData.groupID}
          onChange={handleChange}
          select
          label="Kelompok"
        >
          {groups.length > 0 ? (
            groups.map((group) => (
              <MenuItem key={group.id} value={group.id}>
                {group.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No Groups Available</MenuItem>
          )}
        </TextField>

        <TextField
          id="golongan"
          name="golongan"
          value={formData.golongan}
          onChange={handleChange}
          select
          label="Golongan"
        >
          <MenuItem value={1}>Siaga</MenuItem>
          <MenuItem value={2}>Penggalang</MenuItem>
          <MenuItem value={3}>Penegak</MenuItem>
          <MenuItem value={4}>Pandega</MenuItem>
        </TextField>

        <TextField
          value={formData.tingkatan || ""}
          onChange={handleChange}
          select
          id="tingkatan"
          name="tingkatan"
          label="Tingkatan"
          disabled={!formData.golongan}
          sx={{
            backgroundColor: labelColors[formData.tingkatan] || "transparent",
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: labelColors[formData.tingkatan] || "#ccc",
              },
              "&:hover fieldset": {
                borderColor: labelColors[formData.tingkatan] || "#aaa",
              },
              "&.Mui-focused fieldset": {
                borderColor: labelColors[formData.tingkatan] || "#666",
              },
            },
          }}
        >
          {tingkatanOptions[formData.golongan]?.map((id) => (
            <MenuItem key={id} value={id} sx={{ backgroundColor: labelColors[id], color: "white" }}>
              {tingkatanLabels[id]}
            </MenuItem>
          ))}
        </TextField>


        <Button type="submit">Add Member</Button>
      </Box>


      <h1>Members - Manage</h1>
      <hr></hr>

      <h3>Actions</h3>
      <Button type="submit"
        disabled={selectedRows >= 0}
        onClick={handleOpenDialog}
        variant="contained"
      >
        Delete
      </Button>
      {selectedRows.length} records

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
