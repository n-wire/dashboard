import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Code from '../code/Code'
import { useDispatch, useSelector } from 'react-redux';
import { closeFile, selectActiveFileIndex, selectOpenFiles, selectProject, setActiveFile } from './developSlice';
import { Close } from '@mui/icons-material';
import { IconButton, Grid} from '@mui/material';
import { red } from '@mui/material/colors';
import Frame from '../dashboard/Frame';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <div sx={{ p: 3, display: 'inline-block' }}>
          {children}
        </div>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function MainPage() {
  const dispatch = useDispatch();
  const activeFile = useSelector(selectActiveFileIndex);
  const files = useSelector(selectOpenFiles);
  const project = useSelector(selectProject);
  const [overme, setOverme] = React.useState(-1);
  const [codeHeight, setCodeHeight] = React.useState(0);

  React.useEffect(() => {
    window.onresize = ()=>{
      handleSize();
    };
    handleSize();
  }, []);

  const handleChange = (event, newValue) => {
    dispatch(setActiveFile(newValue));
  };

  const handleSize = ()=> {
    var elmnt = document.getElementById("myDIV");
    var header = document.getElementById("tabheader");
    setCodeHeight(elmnt?.clientHeight-(header?.clientHeight+5));
  }

  return (
    <Box id="myDIV" sx={{ width: '100%', height:'100%' }}>
      <Box id="tabheader" sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeFile} onChange={handleChange} aria-label="basic tabs example">
          {
            files.map((file, index)=>(
              <Tab {...a11yProps({index})} key={index} 
                label={
                  <span>
                    {file.name}
                    <IconButton sx={{display:overme===index?'inline':'none'}} size="small" onClick={() => dispatch(closeFile({name: file.name}))}>
                      <Close sx={{ color: red[500] }} fontSize="small"/>
                    </IconButton>
                  </span>
                } 
                onMouseLeave={()=>setOverme(-1)}
                onMouseEnter={()=>setOverme(index)}
              />
            ))
          }
        </Tabs>
      </Box>
      {
          files.map((file, index)=>(
            <TabPanel value={activeFile} index={index} key={index} sx={{ height:'100%', width:'100%'}}>
              <Grid container direction="row" spacing={3} sx={{height:'100%'}}>
                <Grid item xs={file.type==='pages'?6:'auto'} sx={{display:'flex', flex:1, height:'100%', width:'100%', overflowY:'hidden'}}>
                  <Code content={file.content} mode={file.type==='pages'?"htmlmixed":"python"} height={codeHeight} />
                </Grid>
                {file.type==='pages' && <Grid item xs={6} sx={{overflowY:'scroll', marginTop:3, width:'100%'}}><Frame sx={{display:'flex', flex:1, margin:1}} content={file.content} name="preview_???" pages={project.pages} /></Grid>}
              </Grid>
            </TabPanel>
          ))
        }
    </Box>
  );
}