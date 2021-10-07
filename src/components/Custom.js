
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
      this.update = this.update.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if(!_.isEqual(state.properties, props))
        return {
            properties: props
        };
        return null;
    }

    isVar(expr){
        let isnum = /^\d+$/.test(expr);
        if(isnum || expr.startsWith('[') || expr.startsWith('{')) return false;
        console.log('isvar', expr)
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
                _.set(execution.vars, '__args', para);
                //execution.doAction(`args=${para}`)
                execution.execute(arguments[0].replace('action:',''));
            }
        }
        else if(typeof expr==='string' && expr.startsWith('component:'))
        {
            return this.processElement(execution.eval(expr.replace('component:','')))
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

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.log(error, errorInfo);
    }

    processIter(element){
        const {Type, content, ...properties} = element;
        let thelist;
        let cont = [];

        thelist = execution.getVal(properties.channel.replace('expr:', ''));
        for(let iter in thelist)
        {
            let theitem = JSON.stringify(content);
            theitem = theitem.replace(new RegExp('{'+properties.iter+'}', 'g'), iter);
            let children = JSON.parse(theitem);

            for(let cc of children)
                cont.push(this.processElement(cc, iter))
        }

        if(Type in Widget.components)
        {
            return React.createElement(Widget.components[Type], this.processProps(properties), cont);
        }
        else
            return React.createElement(Type, this.processProps(properties), cont);
    }

    processElement(element, key=0){
        if(typeof element === 'string')
            return element;
        else if ('iter' in element){
            return this.processIter(element);
        }
        else {
            const {Type, content, ...props} = element;
            let children;
            if(Widget.pages.findIndex(p=>p.name==Type)!==-1)
            {
                var page = Widget.pages.find((p)=>{
                    return p.name===Type;
                });
                if(page===undefined) return null;
                return <Widget content={page.content} properties={(content!==undefined)?{...props, content}:props} format="xml" />
            }
            else if(content!==undefined && content.__proto__.constructor.name==="Array")
            {
                children = []
                for(const child in content){
                    children.push(this.processElement(content[child], child))
                }
            }
            else
                children = this.eval(content);

            if(Type in Widget.components)
            {
                return React.createElement(Widget.components[Type], {...this.processProps(props), key:key}, children);
            }
            else
                return React.createElement(Type, {...this.processProps(props), key:key}, children);
        }
    }

    processProps(properties){
        var props = {};
        for(let p in properties)
        {
            if(p!=='Type' && p!=='content')
            {
                var expr = this.eval(properties[p]);
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
                    expr = expr.bind(this, properties[p]);
                }
                if(p==='class')
                    props['className'] = expr;
                else
                    props[p] = expr;
            }
        }

        return props;
    }

    render(){
        if(this.state.hasError) return <div>
                <h1>Something went wrong.</h1>
                <button onClick={()=>this.setState({hasError:false})}>Reload</button>
            </div>;
        if(this.state.properties.Type!==undefined)
            try
            {
                return this.processElement(this.state.properties);
            }
            catch(e)
            {
                console.log(e)
                return null;
            }
        else
            return null;
    }
};