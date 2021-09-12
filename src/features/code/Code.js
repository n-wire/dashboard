import React from 'react'
import { execution } from '../../components/Execution';
import { nw } from 'nodewire';
import invoke from '../../invoke';
import { string } from 'prop-types';
import _ from 'lodash'

export default function Code(props) {
  React.useEffect(async () => {
    const thecode = window.CodeMirror.fromTextArea(document.getElementById('mytextarea'/* + this.state.name*/), { value:  '', mode: "htmlmixed", height: 30, selectionPointer: true });
    thecode.setSize(null, 400)

    nw.onStart(async ()=>{
      const thenode = await nw.getNode('code');
      console.log('got code node', thenode, thenode.val)
      thenode.setHandler({
        onVal: async ({ cmd, param }) => {
          if (cmd === 'load') {
            let app = await invoke('open_app', { appname: param });
            if(typeof app === "object")
            {
              thecode.setValue(app.layout[0].content);
              execution.execute('_code="' + thecode.getValue() + '"')
              props.onEvent('thecode.getValue()');
            }
            else
            {
              alert(app)
            }
          }
          else if (cmd === 'save') {
            const app = {
              'icon': '',
              'layout': [{name:'layout', content: thecode.getValue()}],
              'title': param,
              'script': [],
              'sketch': []
            }
            let result = await invoke('save_app', { app: app });
            alert(result)
          }
          else if (cmd === 'create') {
            let app = await invoke('create_app', {appname: param }); 
            if(typeof app === "string")
            {
              alert(app)
              console.log(app)
            }
            thecode.setValue('');
          }
        },
      });
    })

    //thecode.on("change", (cm, change)=> { SetCode(thecode.getValue()); })
    thecode.on("blur", () => {
      _.set(execution.vars,'_code', thecode.getValue());
      props.onEvent('thecode.getValue()');
    })
  }, []);

  return (
    <textarea id="mytextarea" variant="outlined" style={{ width: '100%', margin: 'auto' }}></textarea>
  )
}