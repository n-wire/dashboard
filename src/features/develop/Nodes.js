import * as React from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { AddBox, Description, Dvr, ElectricalServices, Folder } from '@mui/icons-material';
import { nw } from 'nodewire';
import invoke from '../../invoke'

export default function Nodes() {
  const [open, setOpen] = React.useState(-1);
  const [nodes, setNodes] = React.useState([{name:'node01'}, {name:'node02'}])

  React.useEffect(() => {
    nw.onStart(()=>{
      console.log(nw.nodes)
      setNodes(handleNodes(nw.nodes))
      nw.when('nodes', n=>handleNodes(nw.nodes))
    })
  },[]);


  const handleNodes = (n) =>  {
    let ns = []
    for(const [nodename, nodebody] of Object.entries(n)){
      ns.push({name:nodename, ports: nodebody})
    }
    return ns;
  }

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      {
        nodes.map((node, index)=>(
          <div key={index}>
            <ListItemButton onClick={()=>setOpen(index===open?-1:index)}>
              <ListItemIcon>
                <Dvr />
              </ListItemIcon>
              <ListItemText primary={node.name} />
              {(open===index) ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={(open===index)} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {
                  node.ports !== undefined &&
                  Object.entries(node.ports).map(([port, value])=>(
                    <ListItemButton sx={{ pl: 4 }} key={port}>
                      <ListItemIcon>
                        <ElectricalServices />
                      </ListItemIcon>
                      <ListItemText primary={port} />
                    </ListItemButton>
                  ))
                }
              </List>
            </Collapse>
          </div>
        ))
      }
      <ListItemButton onClick={()=>{
         nw.once('ghosts', async msg=>{
          let ghosts = msg.params
          if(ghosts.length===0)
            alert('No new node found')
          else {
            let app = prompt('new name of node or leave blank to use '+ ghosts[0])
            if(app!==null)
              await invoke('register', { nodename: ghosts[0], id:'1234', newname: (app!=='')?app:ghosts[0]});
          }
        });
        nw.send('cp get ghosts '+nw.address)
      }}>
        <ListItemIcon>
          <AddBox />
        </ListItemIcon>
        <ListItemText primary="Add Node" />
      </ListItemButton>
    </List>
  );
}
