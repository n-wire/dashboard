
import React from 'react';
import {nw}  from 'nodewire'
import {execution} from './Execution.js'
import Widget from './Widget.js';
import _ from 'lodash';

/*
  <Custom  />
*/

export default class Custom extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        properties: props,
        hasError: false
      };

      this.vars = [];
      this.firstPassDone = false;

      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleChange = this.handleChange.bind(this);
      this.update = this.update.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if(!_.isEqual(state.properties, props))
        return {
            properties: props
        };
        return null;
    }

    handleSubmit(event) {
        event.preventDefault();
        if('submit' in this.state.properties){
            let dp = this.state.properties.submit.indexOf('.');
            let node = this.state.properties.submit.slice(0,dp);
            let port = this.state.properties.submit.slice(dp+1);

            let dd = {};
            for(var key=0; key<event.target.length-1; key++){
                dd[event.target[key].id] = event.target[key].value;
            }

            nw.setportvalue(node, port, dd);
        }
    }

    handleChange(e)
    {
        if('change' in this.state.properties){
            let dp = this.state.properties.change.indexOf('.');
            let node = dp===-1?'':this.state.properties.change.slice(0,dp);
            let port = this.state.properties.change.slice(dp+1);
            if(node==="")
                execution.execute(`${port}="${e.target.value}"`)
            else
                nw.setportvalue(node, port, this.state.properties.type==='checkbox'? e.target.checked : e.target.value);
        }
    }

    isVar(expr){
        let isnum = /^\d+$/.test(expr);
        if(isnum || expr.startsWith('[') || expr.startsWith('{')) return false;
        return true
    }

    eval(expr)
    {
        if(typeof expr==='string' && expr.trim().startsWith('expr:'))
        {
            if(!this.firstPassDone) {
                const operators = [" if ", " else ", " and ", " or ", " not ",  "==", "!=", ">", "<", ">=", "<=", "+", "-", "*", "/", "%"];
                let index=0, op=0;
                expr = expr.trim().replace('expr:', '');
                ({index, op} = execution.parse(expr));
                if(index===0) {
                    if(this.isVar(expr) && this.vars.indexOf(expr)===-1)this.vars.push(expr);
                }
                else
                {
                    let op1 = expr.substring(0, index);
                    op1 = op1.trim();
                    if(op1.charAt(0)==='(')
                    {
                        op1 = op1.substr(1).slice(0, -1);
                    }
            
                    let op2 = expr.substring(index+1, expr.length);
                    op2 = op2.substr(operators[op].length-1);
                    op2 = op2.trim();
                    if(op2.charAt(0)==='(')
                    {
                        op2 = op2.substr(1).slice(0, -1);
                    }

                    if(this.isVar(op1) && this.vars.indexOf(op1)===-1)this.vars.push(op1);
                    if(this.isVar(op2) && this.vars.indexOf(op2)===-1)this.vars.push(op2);
                }
                
            }
            return execution.eval(expr.trim().replace('expr:', ''));
        }
        else if(typeof expr==='string' && expr.startsWith('json:'))
            return execution.eval(expr.replace('json:', ''));
        else if(typeof expr==='string' && expr.startsWith('action:'))
        {
            return (...para)=>{
                //const args = Array.from(arguments);
                //_.set('me.arguments', para);
                //execution.doAction(`args=${para}`)
                execution.execute(arguments[0].replace('action:',''));
            }
        }
        else {
            return expr;
        }
    }

    update(){
        this.forceUpdate();
    }

    componentWillUnmount()
    {
        for(let v of this.vars){
            nw.unsubscribe(v, this.update);
        }
        this.firstPassDone = false;
    }

    componentDidMount()
    {
        this.pageupdate=(newlayout)=>{
            newlayout.name = this.props.properties.name;
            this.setState({properties: newlayout})
        };
        this.pageupdate = this.pageupdate.bind(this);
        this.firstPassDone = true;

        for(let v of this.vars){
            nw.when(v, this.update);
        }

    }

    render(){
        if(this.state.hasError) return <h1>Something went wrong.</h1>;
        if(this.state.properties.Type!==undefined && (this.state.properties.Type.endsWith('.xml') || this.state.properties.Type.endsWith('.json')))
        {
            var page = nw.pages.filter((p)=>{
                return p.name===this.state.properties.Type;
            });
            if(page.length===0) return null;
            return <Widget tab={page[0]} properties={this.state.properties}/>
        }
        else if(this.state.properties.Type!==undefined)
            try
            {
                var cont = null;
                if(this.state.properties.content!==undefined && this.state.properties.content.Type!==undefined)
                {
                    if(this.state.properties.iter===undefined)
                    {
                        let cc;
                        var properties = this.state.properties;
                        if(properties.channel!==undefined)
                        {
                            let dp = properties.channel.indexOf('.');
                            let node = properties.channel.slice(0,dp);
                            let port = properties.channel.slice(dp+1);
                            cc = properties.content;
                            cc.content = nw.getportvalue(node,port);
                        }
                        else
                           cc = this.state.properties.content;
                        if(typeof cc.properties === Object && ! ('Type' in cc.properties))
                            cc = null;
                        cont =  <Custom {...cc} />;
                    }
                    else
                    {
                        cont = [];
                        var thelist;
                        var template = this.state.properties.content;
                        let properties = this.state.properties;
                        //let dp = properties.channel.indexOf('.');
                        //template.node = properties.channel.slice(0,dp);

                        thelist = execution.getVal(properties.channel.replace('expr:', ''));
                        for(var iter in thelist)
                        {
                            var theitem = JSON.stringify(template);
                            //theitem = theitem.replace('{'+this.state.properties.iter+'}', iter);
                            theitem = theitem.replace(new RegExp('{'+this.state.properties.iter+'}', 'g'), iter);
                            cont.push(<Custom {...JSON.parse(theitem)} key={iter}  />)
                        }
                    }
                }
                else if(this.state.properties.content!==undefined && this.state.properties.content.__proto__.constructor.name==="Array")
                {
                    if(this.state.properties.iter===undefined)
                    {
                        cont = [];
                        for(var cc in this.state.properties.content)
                        {
                            if(typeof this.state.properties.content[cc] === 'string')
                                cont.push(this.state.properties.content[cc]);
                            else
                                cont.push(<Custom {...this.state.properties.content[cc]} key={cc}  />)
                        }
                    }
                    else
                    {
                        cont = [];
                        let thelist;
                        let template = this.state.properties.content;
                        let properties = this.state.properties;

                        thelist = execution.getVal(properties.channel.replace('expr:', ''));
                        for(let iter in thelist)
                        {
                            let theitem = JSON.stringify(template);
                            //theitem = theitem.replace('{'+this.state.properties.iter+'}', iter);
                            theitem = theitem.replace(new RegExp('{'+this.state.properties.iter+'}', 'g'), iter);

                            let elements = JSON.parse(theitem);

                            for(let cc of elements)
                                cont.push(<Custom {...cc} key={iter}  />)
                        }
                    }
                }
                else if (this.state.properties.content!==undefined)
                {
                     cont = this.eval(this.state.properties.content);
                }
                var props = {className: this.state.properties.class};
                for(let p in this.state.properties)
                {
                    if(p!=='Type' && p!=='content')
                    {
                        var expr = this.eval(this.state.properties[p]);
                        if(typeof expr==='string' && p==='style')
                        {
                            let pp = expr.split(';');
                            expr = {};
                            for(let pp1 of pp)
                            {
                                let pp2 = pp1.split(':');
                                expr[pp2[0].trim()] = pp2[1].trim();
                            }
                        }
                        else if(typeof expr === "function")
                        {
                            expr = expr.bind(this, this.state.properties[p]);
                        }
                        if(p==='change')
                            props['onChange'] = this.handleChange;
                        else if(p==='submit')
                            props['onSubmit'] = this.handleSubmit;
                        if(p==='class')
                            props['className'] = expr;
                        else
                            props[p] = expr;
                    }
                }

                let comp;
                if(this.state.properties.Type in Widget.components)
                {
                    // {ComponentName: component}
                    comp = React.createElement(Widget.components[this.state.properties.Type], props, cont);
                }
                else
                    comp = React.createElement(this.state.properties.Type, props, cont);
                return comp;
            }
            catch(e)
            {
                return null;
            }
        else
            return null;
    }
};