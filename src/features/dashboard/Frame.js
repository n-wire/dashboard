import React from 'react'
import Widget from '../../components/Widget.js';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { Counter } from '../counter/Counter';
import Controller from '../controller/Controller';
import Console from '../console/Console';
import Code from '../code/Code';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
      }
}))

const components = {'Counter': Counter, 'Controller': Controller, 'Console': Console, 'Code': Code, 'Button': Button}

export default function Frame(props){
    const classes = useStyles();
    return (
        <Grid item xs={12} md={props.width} lg={props.width}>
            <Paper className={classes.paper} style={{height:props.height}}>
                <Widget {...props} format="xml" components={components} />
            </Paper>
        </Grid>
    );
}