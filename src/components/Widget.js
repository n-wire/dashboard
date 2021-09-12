import { nw, Node } from 'nodewire';
import React from 'react';
import Custom from './Custom.js'
import {execution} from './Execution.js'


/*
  <Widget name="" content="<div>exr:mynode.count</div>" components={components} pages=[{name, content}] channel="node.port" />
*/

export default class Widget extends React.Component{
    static components = [];
    constructor(props) {
        super(props);
        console.log(props.content)
        Widget.components = props.components!==undefined?props.components:[]
        let lo = Widget.load(props.properties, props.content, props.format);
        let channel = (props.channels!==undefined && props.channels.indexOf('.')!==-1)?props.channel.split('.'):[null, null];
        this.state = {
            content: lo,
            prevContent: props.content,
            name: props.name!==undefined?props.name:'Widget_*',
            node: channel[0],
            port: channel[1]
        };
    }

    static getDerivedStateFromProps(props, state) {
        if(state.prevContent!==props.content)
            return {
                content: Widget.load(props.properties, props.content, props.format),
                prevContent: props.content
            };
        return null;
    }

    static load(props, content, format, noscript){
        if(noscript===undefined)
        {
            execution.reset();
        }
        if(typeof content === 'object' && content!=null) return content;
        if(format === 'xml')
        {
            if(props!==undefined)
            for(var p of Object.keys(props))
            {
                var re = new RegExp("{"+p+"}", 'g');
                content = content.replace(re, (typeof props[p]==='string' && props[p].trim().startsWith('expr:'))?execution.eval(props[p].trim().replace('expr:', '')):props[p]);
            }
            if(content === '' || content===undefined) content='<div />';
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(content,"text/xml").children[0];
            if(xmlDoc.nodeName !== "parsererror" && xmlDoc.nodeName!=='html' && !xmlDoc.innerHTML.startsWith('<parsererror'))
                return Widget.xml2json(xmlDoc);
            return { Type: 'div', content: xmlDoc.textContent };
        }
        if(content==="") content = "{}";
        try{
            return JSON.parse(content);
        }
        catch(e)
        {
            return JSON.parse('{}');
        }
    }

    static xml2json(xmlDoc){
        var json_object = {}; var i;
        if(xmlDoc===undefined) return json_object;
        if(xmlDoc.attributes!==undefined)
        for(i = 0; i<xmlDoc.attributes.length;i++)
        {
            if(xmlDoc.attributes[i].value.startsWith('json:'))
                json_object[xmlDoc.attributes[i].name] = JSON.parse(xmlDoc.attributes[i].value.replace('json:','').replace(/'/g, '"'));
            else
                json_object[xmlDoc.attributes[i].name] = xmlDoc.attributes[i].value;
        }

        if(xmlDoc.tagName==='script')
        {
            execution.add_script(xmlDoc.textContent);
            json_object = {Type: 'span', content: ''};
        }
        else if(xmlDoc.tagName!==undefined)
            json_object['Type'] = xmlDoc.tagName;
        else if(xmlDoc.nodeName==='#text')
           json_object =  xmlDoc.textContent;//{Type: 'span', content: xmlDoc.textContent};
        else
           return null;

        if(['Div', 'Form', 'fields','inlinefields'].indexOf(xmlDoc.tagName)!==-1){
           json_object['children'] = [];
           for(i = 0; i<xmlDoc.childNodes.length;i++)
           {
              let dnode = Widget.xml2json(xmlDoc.childNodes[i]);
              if(dnode!=null)
                json_object['children'].push(dnode);
           }
        }
        else if(['Row', 'Column', 'Tabs', 'Accordion'].indexOf(xmlDoc.tagName)!==-1){
           json_object['children'] = [];
           for(i = 0; i<xmlDoc.children.length;i++)
           {
              json_object['children'].push(Widget.xml2json(xmlDoc.children[i]));
           }
        }
        else if(xmlDoc.tagName==='Frame' || xmlDoc.tagName==="tab" || xmlDoc.tagName==="item")
        {
            json_object['content'] = Widget.xml2json(xmlDoc.children[0]);
        }
        else if(xmlDoc.attributes!==undefined && xmlDoc.attributes.getNamedItem('iter')!==null)
        {
            json_object['content'] = [];
            for(let v of xmlDoc.children)
                json_object['content'].push(Widget.xml2json(v));//todo this should be childNodes[0]?
        }
        else if(xmlDoc.childNodes.length>1)
        {
           if(['dropdown', 'SearchSelection', 'tr'].indexOf(xmlDoc.tagName)!==-1)
           {
               json_object['content'] = [];
               for(i = 0; i<xmlDoc.children.length;i++)
               {
                  json_object['content'].push(Widget.xml2json(xmlDoc.children[i]));
               }
           }
           else
           {
               json_object['content'] = [];
               for(i = 0; i<xmlDoc.childNodes.length;i++)
               {
                    let ob = Widget.xml2json(xmlDoc.childNodes[i]);
                    if(ob!==null)
                       json_object['content'].push(ob);
                    }
           }
        }
        else if(xmlDoc.childNodes.length!==0 && xmlDoc.tagName!=='img' && xmlDoc.tagName!=='script'){
            json_object['content'] = Widget.xml2json(xmlDoc.childNodes[0]);
        }
        return json_object;
    }

    text2obj(text){
        let obj = text;
        try {
            //obj = text.replace(/'/g, '"');
            obj = text.replace(/False/g, 'false');
            obj = obj.replace(/True/g, 'true');
            obj = obj.replace(/None/g, 'null');
            obj = obj.replace(/undefined/g, 'null');
            obj = JSON.parse(obj);
        } catch (e) {

        }

        return obj;
    }

    setpage(dpage){
        for(let p in this.pages)
        {
            if(this.pages[p].name===dpage)
            {
                let page = this.pages[p];
                if(page.name.endsWith('.xml'))
                {
                    try{
                        return {content: Widget.load(this.props.properties, page.content, 'xml'), format: 'xml'}
                    }
                    catch(ex){return {content: Widget.load(this.props.properties, {}, 'json'), format:'json'};}
                }
                else
                {
                    let content = page.content;
                    if(typeof content === 'string')
                        content = JSON.parse(page.content.replace(/'/g, '"'));
                    return { content: content, format:'json'}
                }
            }
        }
    }

    componentWillUnmount(){
        if(this.theNode!==undefined)
            this.theNode.stop();
    }

    componentDidMount(){
        nw.onStart(async ()=>{
            this.theNode = new Node(this.state.name, {
                inputs: 'json xml page notification val',
                init: node => {
                    execution.run();
                },
                onJson: (node, val) => {
                    var content = JSON.parse(val.replace(/'/g, '"'));
                    this.setState({content: content, format:'json'});
                },
                onVal: (node, val) => {
                    console.log('val', val);
                },
                onXml: (node, val) => {
                    try{
                        this.setState({prevContent: this.props.content, content: Widget.load(this.props.properties, val, 'xml'), format:'xml'});
                    }
                    catch(ex){
                        console.log(ex)
                        this.setState({content: Widget.load(this.props.properties, '{}', 'json')});
                    }
                },
                onPage: (node, val) => {
                    let dpage = ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))? val.slice(1,-1):val;
                    this.setState(this.setpage(dpage));
                },
                onNotification: (node, val) => {
                    if (Notification.permission !== "granted")
                        Notification.requestPermission();
                    new Notification(val.subject, {
                        icon: '/static/nodewire.png',
                        body: val.body,
                    });
                }
            }); 
        });
    }

    render () {
        return(
              <Custom {...this.state.content} onEvent={this.props.onEvent}/>
        )
    }

};