import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import NoteIcon from '@material-ui/icons/Note';
import CreateIcon from '@material-ui/icons/Create';
import SaveIcon from '@material-ui/icons/Save';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import AddBoxIcon from '@material-ui/icons/AddBox';

export function MainListItems(props){
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