import { Box, Grid } from '@mui/material';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveFileIndex, selectOpenFiles, updateFile } from '../develop/developSlice';

let thecode;
export let thedoc;
export let activefile;

export default function Code(props) {
  const dispatch = useDispatch();
  const files = useSelector(selectOpenFiles);
  const fileIndex = useSelector(selectActiveFileIndex);

  const update = ()=> {
    if(!thedoc.isClean()){
      activefile = files[fileIndex];
      dispatch(updateFile({name: activefile.name, content: thecode.getValue(), type: activefile.type}))
      thedoc.markClean();
    }
  }
  
  React.useEffect(() => {
    thecode = window.CodeMirror.fromTextArea(document.getElementById(files[fileIndex].name), { value:  props.content, mode: props.mode, selectionPointer: true });
    thecode.on("blur", () => update())
  }, []);

  React.useEffect(() => {
    thecode.setValue(files[fileIndex].content);
    thecode.setSize('100%', `${props.height-2}px`);
    thedoc = thecode.getDoc();
    activefile = files[fileIndex];
  }, [props]);

  return (
    <Box onMouseLeave={update} sx={{width:'100%', height:'100%'}}>
      <textarea id={files[fileIndex].name} variant="outlined" style={{ width: '100%', margin: 'auto', height:'100%' }}></textarea>
    </Box>
    
  )
}