import * as React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material'
import Files from './Files';
import Nodes from './Nodes';
import Database from './Database';

export default function Explorer() {
    const [expanded, setExpanded] = React.useState('panel1');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    return (
        <div>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>Files</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Files />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
                <   Typography>Nodes</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Nodes />
                </AccordionDetails>
            </Accordion>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
                    <Typography>Database</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Database />
                </AccordionDetails>
            </Accordion>
        </div>
    );
}