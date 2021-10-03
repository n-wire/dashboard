import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { MainListItems, SecondaryListItems } from './listItems';
import Frame from './Frame';
import { execution } from '../../components/Execution';
import {nw} from 'nodewire'
import invoke from '../../invoke';


const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

function DashboardContent(props) {
  const [open, setOpen] = React.useState(true);
  const [code, SetCode] = React.useState("");

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleMenu = async command => {
    let app;
    switch(command){
      case 'new':
        app = prompt('name of App')
        app && nw.send('ee set scriptlet "' + `node('code').val={cmd:'create', param:'${app}'}` + '" ' + nw.address);
        break;
      case 'edit':
        app = prompt('name of App') 
        app && nw.send('ee set scriptlet "' + `node('code').val={cmd:'load', param:'${app}'}` + '" ' + nw.address);
        break;
      case 'save':
        app = prompt('name of App')
        app && nw.send('ee set scriptlet "' + `node('code').val={cmd:'save', param:'${app}'}` + '" ' + nw.address);
        break;
      case 'load':
        app = prompt('name of App')
        app && nw.send('ee set scriptlet "' + `node('code').val={cmd:'exec', param:'${app}'}` + '" ' + nw.address);
        break;
      case 'add':
        nw.once('ghosts', async msg=>{
          let ghosts = msg.params
          if(ghosts.length===0)
            alert('No new node found')
          else {
            app = prompt('new name of node or leave blank to use '+ ghosts[0])
            if(app!==null)
              await invoke('register', { nodename: ghosts[0], id:'1234', newname: (app!=='')?app:ghosts[0]});
          }
        });
        nw.send('cp get ghosts '+nw.address)
        break;

      case 'signout':
        props.signout();
        break;
    }
  }

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              NodeWire
            </Typography>
            <IconButton color="inherit" onClick={()=>props.signout()}>
                <ExitToAppIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
            <Toolbar
                sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
                }}
            >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
            </Toolbar>
            <Divider />
            <List><MainListItems clicked={handleMenu}/></List>
            <Divider />
            <List><SecondaryListItems clicked={handleMenu}/></List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="x1" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3} direction="row">
                <Frame width={6} height={400} content="<Code />" name="code" onEvent={()=>{
                    SetCode(execution.eval('_code'))
                    //execution.execute('code.val=_code')
                }} />
                <Frame width={3} height={400} content={code} name="preview" />
                <Frame width={3} height={400} content="<Controller />" name="window" />
                <Frame width={12} height={300} content="<Console />" name="cons" />
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard(props) {
  return <DashboardContent {...props}/>;
}