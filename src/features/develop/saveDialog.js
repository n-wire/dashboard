import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function SaveDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [filename, setFilename] = React.useState('');

  useEffect(() => {
    if (open !== props.open) {
        setOpen(props.open);
    }
  }, [props, open])

  const handleClose = () => {
    setOpen(false);
    props.onClose();
    setFilename('');
  };

  const handleSave = () => {
    if(filename!==''){
        props.onSave(filename)
        handleClose();
    }
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="File Name"
            type="text"
            fullWidth
            variant="standard"
            value={filename}
            required
            onChange={e=>setFilename(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
