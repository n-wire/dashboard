import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Add, Delete, Description, Folder, PhotoCamera } from '@mui/icons-material';
import { addFile, deleteFile, deleteImageAsync, openFile, selectProject, addImageAsync, setStatus } from './developSlice';
import FileDialog from './fileDialog';
import { IconButton, Input } from '@mui/material';
import { nw } from 'nodewire';

export default function Files() {
  const project = useSelector(selectProject);
  const dispatch = useDispatch();
  const [pages, setPages] = React.useState(true);
  const [sketches, setSketches] = React.useState(false);
  const [images, setImages] = React.useState(false);
  const [addpage, setAddpage] = React.useState(false);
  const [addSketch, setAddsketch] = React.useState(false);
  const [deleteBtn, setDeleteBtn] = React.useState({type:'', index:-1});

  const handleDeleteImage = (file)=> {
    const filename = window.location.protocol+'//' + nw.server + `:${process.env.REACT_APP_API_SERVER_PORT}/storage/${nw.instance}/${file.name}`;
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
      if (result.state == "granted" || result.state == "prompt") {
        navigator.clipboard.writeText(encodeURI(filename)).then(function() {
          dispatch(setStatus({message:'image url copied to clipboard', severity:'info'}));
        }, function() {
          dispatch(setStatus({message:'image url not copied', severity:'warning'}));
        });
      }
    });
  }

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton  onClick={()=>setPages(!pages)}>
        <ListItemIcon>
          <Folder />
        </ListItemIcon>
        <ListItemText primary="Pages" />
        {pages ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={pages} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {
            project.pages.map((file, index)=>(
              <ListItemButton sx={{ pl: 4 }} key={index} onClick={()=>{dispatch(openFile({name: file.name, type: 'pages'}))}}>
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText sx={{overflow: "hidden", textOverflow: "ellipsis", width: '11rem'}} primaryTypographyProps={{noWrap:true}} primary={file.name} 
                  onMouseEnter={()=>setDeleteBtn({type:file.type, index:index})} onMouseLeave={()=>setDeleteBtn({type:file.type, index:-1})}
                />
                <IconButton sx={{display:(index===deleteBtn.index && file.type===deleteBtn.type)?'inline':'none'}} aria-label="delete file" component="span"
                  onMouseEnter={()=>setDeleteBtn({type:file.type, index:index})} onMouseLeave={()=>setDeleteBtn({type:file.type, index:-1})}>
                  <Delete color="error" onClick={()=>{
                    dispatch(deleteFile({name:file.name, type:'pages'}))
                  }} />
                </IconButton>
              </ListItemButton>
            ))
          }
          <ListItemButton>
            <ListItemIcon onClick={()=>setAddpage(true)}>
              <Add/>
            </ListItemIcon>
            <ListItemText primary="add" onClick={()=>setAddpage(true)} />
            <FileDialog open={addpage} 
              onAdd={(filename)=>{dispatch(addFile({name:filename, type:'pages'}))}}
              onClose={()=>setAddpage(false)}
            />
          </ListItemButton>
        </List>
      </Collapse>

      <ListItemButton  onClick={()=>setSketches(!sketches)}>
        <ListItemIcon>
          <Folder />
        </ListItemIcon>
        <ListItemText primary="Sketches" />
        {sketches ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={sketches} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {
            project.sketches.map((file, index)=>(
              <ListItemButton key={file.name} sx={{ pl: 4 }} key={file.name} onClick={()=>{dispatch(openFile({name: file.name, type: 'sketches'}))}}>
                <ListItemIcon>
                  <Description />
                </ListItemIcon>
                <ListItemText sx={{overflow: "hidden", textOverflow: "ellipsis", width: '11rem'}} primaryTypographyProps={{noWrap:true}} primary={file.name} 
                  onMouseEnter={()=>setDeleteBtn({type:file.type, index:index})} onMouseLeave={()=>setDeleteBtn({type:file.type, index:-1})}
                />
                <IconButton sx={{display:(index===deleteBtn.index && file.type===deleteBtn.type)?'inline':'none'}} aria-label="delete file" component="span" onMouseLeave={()=>setDeleteBtn({type:file.type, index:-1})}>
                  <Delete color="error" onClick={()=>{
                    dispatch(deleteFile({name:file.name, type:'sketches'}))
                  }} />
                </IconButton>
              </ListItemButton>
            ))
          }
          <ListItemButton>
            <ListItemIcon onClick={()=>setAddsketch(true)}>
              <Add/>
            </ListItemIcon>
            <ListItemText primary="add" onClick={()=>setAddsketch(true)} />
            <FileDialog open={addSketch} 
              onAdd={(filename)=>{dispatch(addFile({name:filename, type:'sketches'}))}}
              onClose={()=>setAddsketch(false)}
            />
          </ListItemButton>
        </List>
      </Collapse>

      <ListItemButton onClick={()=>setImages(!images)}>
        <ListItemIcon>
          <Folder />
        </ListItemIcon>
        <ListItemText primary="Images" />
        {images ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={images} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {
            project.images.map((file, index)=>(
              <ListItemButton key={file.name} sx={{ pl: 4 }}>
                <ListItemIcon onClick={()=>handleDeleteImage(file)}>
                  <Description />
                </ListItemIcon>
                <ListItemText primary={file.name} onClick={()=>handleDeleteImage(file)} onMouseEnter={()=>setDeleteBtn({type:file.type, index:index})} onMouseLeave={()=>setDeleteBtn({type:file.type, index:-1})} />
                <IconButton sx={{display:(index===deleteBtn.index && file.type===deleteBtn.type)?'inline':'none'}} aria-label="delete file" component="span" 
                  onMouseEnter={()=>setDeleteBtn({type:file.type, index:index})} onMouseLeave={()=>setDeleteBtn({type:file.type, index:-1})}>
                  <Delete color="error" onClick={()=>{
                    dispatch(deleteImageAsync({name:file.name}))
                  }} />
                </IconButton>
              </ListItemButton>
            ))
          }
          <label htmlFor="icon-button-file">
            <Input accept="image/*" id="icon-button-file" sx={{display:'none'}} type="file" onChange={e=>dispatch(addImageAsync(e.target.files[0]))}/>
            <IconButton sx={{ pl: 2 }} aria-label="upload picture" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
        </List>
      </Collapse>
    </List>
  );
}
