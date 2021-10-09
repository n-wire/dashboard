import React, { useState } from 'react'
import { Box, Button, Grid, Container, CssBaseline, Snackbar, Alert, Typography, IconButton } from '@mui/material'
import { Paper } from '@mui/material'
import { Folder, ExitToApp, PlayArrow, Phonelink, CloudUpload, CloudDownload, ExitToAppOutlined, Stop } from '@mui/icons-material'
import MainPage from './MainPage'
import Explorer from './Explorer'
import Toolbox from './Toolbox'
import Properties from './Properties'
import Console from '../console/Console'
import NoteIcon from '@mui/icons-material/Note';
import FolderOpen from '@mui/icons-material/FolderOpen'
import Save from '@mui/icons-material/Save'
import { selectStatus, setStatus, loadProjectAsync, saveProjectAsync, selectProject, newProject} from './developSlice'
import { useDispatch, useSelector } from 'react-redux'
import SaveDialog from './saveDialog'
import OpenDialog from './openDialog'
import { nw } from 'nodewire'

export default function Develop(props) {
    const [saveProject, setSaveProject] = useState(false)
    const [openProject, setOpenProject] = useState(false)
    const dispatch = useDispatch()
    const status = useSelector(selectStatus);
    const project = useSelector(selectProject);
    const handleClose = () => dispatch(setStatus(''))
    return (
        <React.Fragment>
            <Container maxWidth={false}>
                <Snackbar
                    open={status!==''}
                    autoHideDuration={6000}
                    onClose={handleClose}>
                    <Alert severity={status.severity}>{status.message}</Alert>
                </Snackbar>
                <SaveDialog open={saveProject} 
                    onClose={()=>setSaveProject(false)}
                    onSave={filename=>dispatch(saveProjectAsync({...project, title: filename}))}
                />
                <OpenDialog open={openProject} 
                    onClose={()=>setOpenProject(false)}
                    onOpen={filename=>dispatch(loadProjectAsync(filename))}
                />
                <Grid container spacing={1}  sx={{display: 'flex', width:'100%', height: '100vh', flexDirection:'column'}}>
                    <Box xs={12} md={12} sx={{marginTop:1, marginBottom:1, width:'100%', backgroundColor: 'gray', display: { sm:'node', xs: 'none', md: 'block' }}}>
                        <Paper spacing={5} sx={{display:'flex'}}>
                            <Button startIcon={<NoteIcon />} onClick={()=>dispatch(newProject())}>
                                New
                            </Button>
                            <Button startIcon={<FolderOpen />} onClick={()=>setOpenProject(true)}>
                                Open
                            </Button>
                            <Button startIcon={<Save />} onClick={()=>{
                                if(project.title!=='')
                                    dispatch(saveProjectAsync(project))
                                else
                                    setSaveProject(true);
                            }}>
                                Save
                            </Button>
                            <Button startIcon={<PlayArrow />} onClick={()=>{
                                nw.send(`ee set scriptlet "exec('${project.title}')" ${nw.address}`);
                                nw.getNode(project.title);
                            }}>
                                Run
                            </Button>
                            <Button startIcon={<Stop />} onClick={()=>{
                                nw.send(`ee set scriptlet "kill('${project.title}')" ${nw.address}`);
                            }}>
                                Stop
                            </Button>
                            <Button startIcon={<Phonelink />}>
                                Deploy
                            </Button>
                            <Button startIcon={<CloudUpload />}>
                                Publish
                            </Button>
                            <Button startIcon={<CloudDownload />}>
                                UnPublish
                            </Button>
                            <Typography sx={{flexGrow: 1, }} align="center" component="span" variant="h6" color="inherit" noWrap>{project.title}</Typography>
                            <IconButton color="inherit" onClick={()=>props.signout()}>
                                <ExitToAppOutlined color="primary" />
                            </IconButton>
                        </Paper>
                    </Box>
                    <Grid container item spacing={1} sx={{display:'flex', flex:1, overflow:'hidden'}}>
                        <Grid item xs={12} md={4} lg={2}>
                            <Paper sx={{height:'100%'}}>
                                <Explorer />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={8} lg={8} sx={{display:'flex', flexDirection:'column'}}>
                            <Grid item sx={{flexGrow:1}}>
                                <Paper sx={{height:'100%'}}>
                                    <MainPage />
                                </Paper>
                            </Grid>
                            <Grid item sx={{alignSelf:'flex-end', width:'100%'}}>
                                <Console />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} lg={2} sx={{display: { xs:'block', md: 'none', lg: 'block' }}}>
                            <Grid item>
                                <Paper sx={{height:'100%'}}>
                                    <Toolbox />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </React.Fragment>
    )
}