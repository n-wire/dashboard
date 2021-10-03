import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Controls from './Controls'

export default function Properties(props) {
  const [values, setValues] = React.useState([]);
  const copy = () =>{
    navigator.permissions.query({name: "clipboard-write"}).then(result => {
        if (result.state == "granted" || result.state == "prompt") {
          let attributes = values.map((v,i)=>v===undefined||v===''?'':`${Object.keys(control.properties)[i]}="${v}"`)
          let element;
          if(Object.keys(control.properties).indexOf('content')===-1){
            element = `<${control.name} ${attributes.filter(a=>a!=='').join('\n    ')} />`
          }
          else
          {
            let content = values[Object.keys(control.properties).indexOf('content')] || ''
            attributes.splice(Object.keys(control.properties).indexOf('content'),1)
            element = `<${control.name} ${attributes.filter(a=>a!=='').join('\n    ')} >${'\n    '+content+'\n'}</${control.name}>`
          }
          navigator.clipboard.writeText(element).then(function() {
              alert('copied to clippboard')
          }, function() {
              alert('failed to copy')
          });
        }
    });
  }
  const control = Controls().find(c=>c.name==props.selected);
  console.log(values)
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 100 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell colSpan={2}>{props.selected}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Property</TableCell>
            <TableCell align="right">Values</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(control?.properties || {}).map(([name, type], index) => (
            <TableRow
              key={name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }}}
            >
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
              <TableCell align="right">
                {typeof type === "string" && <TextField variant="standard" value={values[index]} onChange={e=>{
                  let v = [...values]
                  v[index] = e.target.value;
                  setValues(v)
                }} />}
                {typeof type === 'object' && 
                  <Box>
                    <FormControl fullWidth>
                      <InputLabel></InputLabel>
                      <Select
                        value={values[index]}
                        onChange={e=>{
                          let v = [...values]
                          v[index] = e.target.value;
                          setValues(v)
                        }}
                      >
                        {
                          type.map(option=>(
                            <MenuItem value={option}>{option}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Box>}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button sx={{width:'100%'}} onClick={()=>copy(props.selected)}>Copy</Button>
    </TableContainer>
  );
}
