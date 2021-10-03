import { Box, Grid } from '@mui/material';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectActiveFileIndex, selectOpenFiles, updateFile } from '../develop/developSlice';

let thecode;
let thedoc;

export default function Code(props) {
  const dispatch = useDispatch();
  const files = useSelector(selectOpenFiles);
  const fileIndex = useSelector(selectActiveFileIndex);

  const update = ()=> {
    let activefile = files[fileIndex];
    dispatch(updateFile({name: activefile.name, content: thecode.getValue(), type: activefile.type}))
  }
  
  React.useEffect(() => {
    thecode = window.CodeMirror.fromTextArea(document.getElementById(files[fileIndex].name), { value:  props.content, mode: props.mode, selectionPointer: true });
    thecode.on("blur", () => update())
    thedoc = thecode.getDoc();
  }, []);

  React.useEffect(() => {
    thecode.setValue(files[fileIndex].content);
    thecode.setSize('100%', `${props.height-2}px`)
  }, [props]);

  return (
    <Box onMouseLeave={update} sx={{width:'100%', height:'100%'}}>
      <textarea id={files[fileIndex].name} variant="outlined" style={{ width: '100%', margin: 'auto', height:'100%' }}></textarea>
    </Box>
    
  )
}