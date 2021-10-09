import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Delete, Folder } from '@mui/icons-material';
import invoke from '../../invoke';
import {nw} from 'nodewire'

export default function OpenDialog(props) {
  const [open, setOpen] = React.useState(false);
  const [filename, setFilename] = React.useState('');
  const [projects, setProjects] = useState([]);

  useEffect(async () => {
    setProjects(await invoke('list_apps'))
  },[props.open])

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

  const handleAdd = () => {
    if(filename!==''){
        props.onOpen(filename)
        handleClose();
    }
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Open Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Project Name"
            type="text"
            fullWidth
            variant="standard"
            value={filename}
            required
            onChange={e=>setFilename(e.target.value)}
          />
            <List>
              {projects.map(project=>(
                <ListItem
                  key = {project.title}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete" onClick={async ()=>{
                        await invoke('delete_app', {appname:project.title})
                        setProjects(await invoke('list_apps'))
                    }}>
                      <Delete />
                    </IconButton>
                  }
                >
                  <ListItemAvatar onClick={()=>setFilename(project.title)}>
                    {project.icon === null && 
                    <Avatar>
                      <Folder />
                    </Avatar>}
                   {project.icon !== null && <Avatar alt={project.icon} src={window.location.protocol+'//' + nw.server + `:${process.env.REACT_APP_API_SERVER_PORT}/storage/${nw.instance}/${project.icon}`} />}
                  </ListItemAvatar>
                  <ListItemText
                    primary={project.title}
                    onClick={()=>setFilename(project.title)}
                  />
                </ListItem>
              ))}
            </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Open</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
