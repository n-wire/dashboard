import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import NoteIcon from '@mui/icons-material/Note';
import CreateIcon from '@mui/icons-material/Create';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CodeIcon from '@mui/icons-material/Code';
import {useHistory } from 'react-router-dom';

export function MainListItems(props){
  const history = useHistory();
  return <div>
    <ListItem button onClick={()=>props.clicked("new")}>
      <ListItemIcon>
        <NoteIcon />
      </ListItemIcon>
      <ListItemText primary="New" />
    </ListItem>
    <ListItem button onClick={()=>props.clicked("edit")}>
      <ListItemIcon>
        <CreateIcon />
      </ListItemIcon>
      <ListItemText primary="Edit" />
    </ListItem>
    <ListItem button onClick={()=>props.clicked("save")}>
      <ListItemIcon>
        <SaveIcon />
      </ListItemIcon>
      <ListItemText primary="Save" />
    </ListItem>
    <ListItem button onClick={()=>props.clicked("load")}>
      <ListItemIcon>
        <FolderOpenIcon />
      </ListItemIcon>
      <ListItemText primary="Load" />
    </ListItem>
    <ListItem button onClick={()=>history.push("/develop")}>
      <ListItemIcon>
        <CodeIcon />
      </ListItemIcon>
      <ListItemText primary="Develop"/>
    </ListItem>
  </div>
}

export function SecondaryListItems(props){
  return <div>
    <ListSubheader inset>Nodes</ListSubheader>
    <ListItem button onClick={()=>props.clicked("reg")}>
      <ListItemIcon>
        <HowToRegIcon />
      </ListItemIcon>
      <ListItemText primary="Register" />
    </ListItem>
    <ListItem button onClick={()=>props.clicked("add")}>
      <ListItemIcon>
        <AddBoxIcon />
      </ListItemIcon>
      <ListItemText primary="Add"/>
    </ListItem>
  </div>
};