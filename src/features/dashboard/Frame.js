import React from 'react'
import Widget from '../../components/Widget.js';
import { Counter } from '../counter/Counter';
import Controller from '../controller/Controller';
import Console from '../console/Console';
import Code from '../code/Code';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Autocomplete from '@mui/material/Autocomplete';
import ButtonGroup from '@mui/material/ButtonGroup';
import Checkbox from '@mui/material/Checkbox';
import Fab from '@mui/material/Fab';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Rating from '@mui/material/Rating';
import {Typography, ListItemAvatar, AvatarGroup, Tooltip, Alert, AccordionSummary, Card, CardActionArea, CardContent, CardHeader, CardMedia, Link, ClickAwayListener, MenuItem, PaginationItem, SpeedDialIcon, StepButton, StepLabel, Tab, Tabs} from '@mui/material';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import { Avatar, Badge, Chip, Divider, FormGroup, Icon, Input, ListItemButton, ListItemSecondaryAction, NativeSelect, Slider, SvgIcon, Switch, TextField } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DataGrid } from '@mui/x-data-grid';
import { ListSubheader } from '@mui/material';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {Skeleton, AlertTitle, Backdrop, Slide, CircularProgress} from '@mui/material';
import { LinearProgress, Snackbar, TabScrollButton, SwipeableDrawer, BottomNavigation, BottomNavigationAction, SnackbarContent } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import { StepIcon, StepContent, StepConnector, Step, MobileStepper, SpeedDialAction, SpeedDial, Popper, Popover, MenuList, Pagination, Menu } from '@mui/material';
import { AppBar, Toolbar, AccordionDetails, AccordionActions, Breadcrumbs, Accordion, Drawer, CardActions } from '@mui/material';

function Autocomplete2(props) {
    const {label, others} = props;
    return (
        <Autocomplete
            {...others}
            renderInput={(params) => <TextField {...params} label={label} />}
        />
    );
};

const components = {'Counter': Counter, 'Controller': Controller, 'Console': Console, 'Code': Code, 
'Box': Box, 'Container': Container, 'Grid': Grid, 'Paper': Paper, 'Stack': Stack, 'ImageList': ImageList, 'ImageListItem': ImageListItem,
'Button': Button, 'AutoComplete2': Autocomplete2, 'ButtonGroup': ButtonGroup, 'Checkbox': Checkbox, 'Fab': Fab, 
'Radio': Radio, 'RadioGroup': RadioGroup, 'FormControlLabel': FormControlLabel, 'FormControl': FormControl, 'FormLabel': FormLabel, 'FormGroup': FormGroup,
'Rating': Rating, 'Typography': Typography, 'Select': Select, 'InputLabel': InputLabel, 'NativeSelect': NativeSelect, 'Slider': Slider, 'Switch': Switch,
'TextField': TextField, 'Input': Input, 'List': List, 'ListItem': ListItem, 'ListItemIcon': ListItemIcon, 'ListItemText': ListItemText, 
'ListItemAvatar': ListItemAvatar, 'ListItemButton': ListItemButton, 'ListItemSecondaryAction': ListItemSecondaryAction, 'ListSubheader': ListSubheader,
'ToggleButton': ToggleButton, 'ToggleButtonGroup': ToggleButtonGroup, 'Avatar': Avatar, 'AvatarGroup': AvatarGroup, 'Badge': Badge, 'Chip': Chip,
'Divider': Divider, 'Icon': Icon, 'SvgIcon': SvgIcon, 'DataGrid': DataGrid, 'Tooltip': Tooltip, 'Skeleton ': Skeleton,
'Table': Table, 'TableBody': TableBody, 'TableCell': TableCell, 'TableContainer': TableContainer, 'TableHead': TableHead, 'TableRow': TableRow,
'Alert': Alert, 'AlertTitle': AlertTitle, 'Backdrop': Backdrop, 'DialogActions': DialogActions, 'DialogContent': DialogContent,
'DialogContentText': DialogContentText, 'DialogTitle': DialogTitle, 'Slide': Slide, 'CircularProgress ': CircularProgress , 'LinearProgress': LinearProgress ,
'Snackbar': Snackbar, 'SnackbarContent': SnackbarContent, 'Accordion': Accordion, 'AccordionActions': AccordionActions, 'AccordionDetails': AccordionDetails, 'AccordionSummary': AccordionSummary,
'AppBar': AppBar, 'Menu': Menu, 'Toolbar': Toolbar, 'Breadcrumbs': Breadcrumbs, 'Link': Link, 'Drawer': Drawer, 'SwipeableDrawer': SwipeableDrawer,
'Card': Card, 'CardActionArea': CardActionArea, 'CardActions': CardActions, 'CardContent': CardContent, 'CardHeader': CardHeader, 'CardMedia': CardMedia,
'BottomNavigation': BottomNavigation, 'BottomNavigationAction': BottomNavigationAction, 'Pagination': Pagination, 'PaginationItem': PaginationItem,
'ClickAwayListener': ClickAwayListener, 'MenuItem': MenuItem, 'MenuList': MenuList, 'Popover': Popover, 'Popper': Popper,
'SpeedDial': SpeedDial, 'SpeedDialAction': SpeedDialAction, 'SpeedDialIcon': SpeedDialIcon,
'MobileStepper': MobileStepper, 'Step': Step, 'StepButton': StepButton, 'StepConnector': StepConnector, 'StepContent': StepContent, 'StepIcon': StepIcon, 'StepLabel': StepLabel, 'Stepper': Stepper,
'Tab': Tab, 'TabScrollButton': TabScrollButton, 'Tabs': Tabs,
}

export default function Frame(props){
    return (
        <Grid item xs={12} md={props.width} {...props}>
            <Widget {...props} format="xml" components={components} />
        </Grid>
    );
}