import * as React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Grid, Paper } from '@mui/material'
import { SmartButton } from '@mui/icons-material';
import Properties from './Properties';
import Controls from './Controls'

export default function Toolbox() {
    const [expanded, setExpanded] = React.useState('panel1');
    const [selected, setSelected] = React.useState('');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <div>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography >Toolbox</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid item container spacing={2} columns={6}>
                        {
                            Controls().map(control=>(
                                <Grid item xs={3} key={control.name} onClick={()=>setSelected(control.name)}>
                                    {control.name}
                                </Grid>
                            ))
                        }
                    </Grid>
                    <Grid item sx={{marginTop:2}}>
                        <Paper sx={{height:'100%'}}>
                            <Properties selected={selected} />
                        </Paper>
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <   Typography>Icons</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>
    
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}