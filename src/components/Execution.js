//tentative and rudimentary implementation of a client-side nwscript interpreter
// https://www.programiz.com/javascript/regex
import {Node, nw} from 'nodewire';
import _ from 'lodash'
import { eventEmitter } from 'nodewire/lib/event';

class Execution{
    constructor(){
        this.whendos = [];  // {condition: cond, actions:[]}
        this.signals = []; // {variable:var, whendos:[]}
        this.pending_signals = [];//[]
        this.scripts_loaded = false;
        this.run = this.run.bind(this);
        this.vars = {};
        this.scripts_hashes = [];
        this.listen = [];
        this.loop = null;
        this.handlers = {};
    }

    reset()
    {
        this.whendos.length = 0;
        this.signals.length = 0;
        this.scripts_hashes.length = 0;
        this.listen.length = 0;
        this.vars.length = 0;
        if(this.loop!==null){
            //clearInterval(this.loop);
            this.loop = null;
        }
        for(const [ev, handler] of Object.entries(this.handlers)) nw.unsubscribe(ev, handler);
    }

    run(){
        var s_this =  this;
        s_this.time = Date.now();
        s_this.seconds = Date.now();
        this.loop = setInterval(()=>{
            if(Date.now()-s_this.time>=200)
            {
                s_this.time = Date.now();
                s_this.add_pending_signal('time');
                if(Date.now()-s_this.seconds>=1000){
                    s_this.seconds = Date.now();
                    s_this.add_pending_signal('time.seconds');
                }
            }
            if(this.pending_signals.length !== 0)
            {
                let signal = s_this.pending_signals.shift();
                let dsignal = s_this.signals.find((s)=>{
                    return s.variable===signal;
                })
                if(dsignal!==undefined)
                {
                    for(var whendo of dsignal.whendos)
                    {
                        if(s_this.eval(whendo.condition))
                        {
                            for(var action of whendo.actions)
                            {
                                s_this.doAction(action);
                            }
                        }
                    }
                }
            }
        }, 20)
    }

    doAction(action)
    {
        const sep = action.lhs.indexOf('.');
        var node = action.lhs.slice(0,sep);
        var port = action.lhs.slice(sep+1);
        if(nw.nodes.hasOwnProperty(node))
        {
            nw.setportvalue(node, port, this.eval(action.rhs));
        }
        else
        {
            _.set(this.vars, action.lhs, this.eval(action.rhs));
            eventEmitter.emit(action.lhs, _.get(this.vars, action.lhs))
            //this.add_pending_signal(action.lhs);
        }
    }

    execute(line)
    {
        let ind = line.indexOf('=');
        let action =  {
            lhs : line.substring(0, ind).trim(),
            rhs: line.substring(ind+1, line.length).trim()
        }
        this.doAction(action);
    }

    text2obj(text){
        if(text.charAt(0)==='"' || text.charAt(0)==="'") return text.slice(1,-1);
        let obj = text;
        try {
            obj = text.replace(/'/g, '"');
            obj = obj.replace(/False/g, 'false');
            obj = obj.replace(/True/g, 'true');
            obj = obj.replace(/None/g, 'null');
            obj = obj.replace(/undefined/g, 'null');
            /*
               1. find unquoted keys and insert quotes, eg {name:"ahmad"} => {"name":"ahmad"}
               2. find unquoted values and evaluate, e.g. {"name", student.name}
               3. convert final obj to json, i.e. JSON.parse(obj)
            */
            const regex = /[a-z_A-Z.]+[a-z_A-Z.1-9]*\s*:/
            let keys = obj.match(regex)
            while(keys!==null)
            {
                obj = obj.replace(keys[0], `"${keys[0].slice(0,-1).trim()}":`);
                keys = obj.match(regex);
            }

            const regex2 = /:\s*[a-z_A-Z.]+[a-z_A-Z.1-9]*/;
            keys = obj.match(regex2);
            while(keys!==null)
            {
                obj = obj.replace(keys[0], ':'+ JSON.stringify(this.eval(keys[0].slice(1).trim())));
                keys = obj.match(regex2);
            }
            obj = JSON.parse(obj);
        } catch (e) {
            console.log(e)
        }

        return obj;
    }

    add_pending_signal(signal)
    {
        this.pending_signals.push(signal);
    }

    parse(expr)
    {
        let operators = [" if ", " else ", " and ", " or ", " not ",  "==", "!=", ">", "<", ">=", "<=", "+", "-", "*", "/", "%"];
        let sus_chars = [ '(', '[', '{', "'", '"'];
        let rev_sus_chars = [ ')', ']', '}', "'", '"'];
        let sus;
        for(let ind=0;ind<16;ind++)
        {
            let n = operators[ind].length;
            let i;
            let suspended = false;
            let len = expr.length;
            for(i=0;i<len;i++)
            {
                //todo handle string, array and object literals and brackets and conditional expressions
                if(!suspended && sus_chars.indexOf(expr.charAt(i))!==-1)
                {
                    suspended = true;
                    sus = sus_chars.indexOf(expr.charAt(i));
                    continue;
                }
                else if(suspended && rev_sus_chars[sus] === expr.charAt(i))
                    suspended = false;

                if(!suspended && operators[ind] === expr.substring(i, i+n))
                {
                    return {index:i, op:ind};
                }

                if(suspended && rev_sus_chars[sus] === expr.charAt(i))
                    suspended = false;
            }
        }

        return {index:0, op:0};
    }

    parseParams(expr){
        let sus_chars = [ '(', '[', '{', "'", '"'];
        let rev_sus_chars = [ ')', ']', '}', "'",'"'];
        let sus;
        let len = expr.length;
        let suspended = false;
        let indices = []
        for(let i=0;i<len;i++)
        {
            if(!suspended && sus_chars.indexOf(expr.charAt(i))!==-1)
            {
                suspended = true;
                sus = sus_chars.indexOf(expr.charAt(i));
                continue;
            }
            else if(suspended && rev_sus_chars[sus] === expr.charAt(i))
                suspended = false;

            if(!suspended && ',' === expr[i])
            {
                indices.push(i)
            }

            if(suspended && rev_sus_chars[sus] === expr.charAt(i))
                suspended = false;
        }
        let params = [], prev = 0;
        for(let i of indices){
            params.push(expr.substring(prev, i).trim());
            prev = i+1;
        }
        params.push(expr.substring(indices[indices.length-1]+1).trim())
        return params;
    }

    func(f){
        if(f==='Node')
            return (name, handler={})=>{
                let nn = new Node(name, handler);
                nw.subscribe(name);
                return nn;
            }
        else if(f==='getNode')
            return name=>nw.getNode(name);
        else if(f==='listen')
        {
            let fn = (a)=>{
                for(const arg of a)
                    this.listen.push(arg);
            }

            return fn;
        }
        else if(f==='print')
            return v=>nw.send("ee set scriptlet 'print(" + JSON.stringify(v) + ")' " + nw.address);
        else if(f==='log')
            return v=>console.log(v);
        else if(f==='int')
            return v=>parseInt(v)
        else
            return ()=>console.log('undefined function: '+f.name)
    }

    getVal(expr){
        //console.log('hehe')
        if(expr.match(/^[a-z_A-Z.]+[a-z_A-Z.1-9]*\(.*\)/))
        {
            // function call
            let func = expr.substring(0, expr.indexOf('('));
            let params = this.parseParams(expr.substring(expr.indexOf('(')+1, expr.length-1))
            let args = []
            for(const param of params)
            {
                args.push(this.eval(param))
            }
            return this.func(func)(...args);
            
        }
        else if(expr.match(/^[a-z_A-Z.]+[a-z_A-Z.1-9]*/))
        {
            const sep = expr.indexOf('.');
            const node = sep!==-1?expr.slice(0,sep):expr;
            if(expr==='time')
                return Date.now()/1000;
            else if(expr.startsWith('time.')){
                let port = expr.split('.')[1];
                if(port==='seconds')
                    return (new Date()).getSeconds();
                else if(port==='minutes')
                    return (new Date()).getMinutes();
            }
            else if(nw.nodes.hasOwnProperty(node))
            {
                //expr = this.handle_indices_params(expr);
                return nw.eval(expr);
            }
            else 
            {
                //expr = this.handle_indices_params(expr);
                return _.get(this.vars, expr);
            }
            
        }
        else {
            return this.text2obj(expr);
        }
    }

    handle_indices_params(expr){
        const regex = /\[\s*[a-z_A-Z.]+[a-z_A-Z.1-9]*]/
        let keys = expr.match(regex)
        while(keys!==null){
            expr = expr.replace(keys[0], '['+ JSON.stringify(this.eval(keys[0].slice(1,-1).trim()))+']')
        }

        return expr;
    }

    eval(expr){
        let operators = [" if ", " else ", " and ", " or ", " not ",  "==", "!=", ">", "<", ">=", "<=", "+", "-", "*", "/", "%"];
        let index=0;
        let op=0;
        ({index, op} = this.parse(expr));
        if(index===0) return this.getVal(expr);
        let op1 = expr.substring(0, index);
        op1 = op1.trim();
        if(op1.charAt(0)==='(')
        {
            op1 = op1.substr(1).slice(0, -1);
            op1 = this.eval(op1);
        }
        else
            op1 = this.eval(op1);

        let op2 = expr.substring(index+1, expr.length);
        op2 = op2.substr(operators[op].length-1);
        op2 = op2.trim();
        if(op2.charAt(0)==='(')
        {
            op2 = op2.substr(1).slice(0, -1);
            op2 = this.eval(op2);
        }
        else
            op2 = this.eval(op2);

        if(operators[op]==="+")
        {
            if(op1 && op1.constructor === Array)
            {
                 if(op2.constructor === Array)
                    return op1.concat(op2);
                 else
                 {
                    op1.push(op2);
                    return op1;
                 }
            }
            return op1 + op2;
        }
        else if(operators[op]==="-")
        {
            return op1 - op2;
        }
        else if(operators[op]==="*")
        {
            return op1 * op2;
        }
        else if(operators[op]==="/")
        {
            return op1 / op2;
        }
        else if(operators[op]==="%")
        {
            return op1 % op2;
        }
        else if(operators[op]==="==")
        {
            return op1 === op2;
        }
        else if(operators[op]==="!=")
        {
            return op1 !== op2;
        }
        else if(operators[op]===">")
        {
            return op1 > op2;
        }
        else if(operators[op]==="<")
        {
            return op1 < op2;
        }
        else if(operators[op]===">=")
        {
            return op1 >= op2;
        }
        else if(operators[op]==="<=")
        {
            return op1 <= op2;
        }
        else if(operators[op]===" and ")
        {
            return op1 && op2;
        }
        else if(operators[op]===" or ")
        {
            return op1 || op2;
        }
        else if(operators[op]===" if ")
        {
            if(op2==="NULL") return op1;
            return op2;
        }
        else if(operators[op]===" else ")
        {
            if(op1===false) return op2;
            return "NULL";
        }

        //todo: not

        return "";
    }

    add_signal(whendo){
        var signals = whendo.condition.split(/[>=]|[&&]|[==]|[<=]|[||]|[+]|[-]|[*]|[/]|[%]| /);
        for(var signal of signals)
        {
            var v = signal.match(/^[a-z_A-Z.]+[a-z_A-Z.1-9]*/)
            if(v) // not a constant
            {
                let s1 = signal;
                let ss = this.signals.find((s)=>{
                    return s.variable===s1;
                })
                if(ss!==undefined)
                {
                    if(!ss.whendos.find((wd)=>{
                        return JSON.stringify(wd) === JSON.stringify(whendo);;
                    })) ss.whendos.push(whendo);
                }
                else {
                    this.signals.push({variable:signal, whendos:[whendo]});
                    //if(signal in this.listen)
                    const hand = v=>{
                        //console.log(v);
                        this.pending_signals.push(s1);
                    }
                    nw.when(signal, hand);
                    this.handlers[signal] = hand;
                }
            }
        }

    }

    split(str){
       return str.split('\n');
    }

    splitPT(str)
    {
        const sep = '\n'
        let separator='';
        //let opposite;
        let looking = true;

        //let stop = 0;

        for(let i = 0;i<str.length;i++)
        {
          if(looking || (separator===sep && str.charAt(i)!==sep))
          {
            if(str.charAt(i)===sep) {
              str = str.substr(0, i) + '`'+ str.substr(i + 1)
              //stop = i;
              //looking = false;
              separator = sep;
            }
            else if(str.charAt(i)==='[')
            {
              separator = '['; looking = false;
            }
            else if(str.charAt(i)==='{')
            {
              separator = '{'; looking = false;
            }
            else if(str.charAt(i)==='"')
            {
              separator = '"'; looking = false;
            }
          }
          else
          {
            if(separator===sep && str.charAt(i)!==sep) looking = true;
            if(separator==='[' && str.charAt(i)===']') looking = true;
            if(separator==='{' && str.charAt(i)==='}') looking = true;
            if(separator==='"' && str.charAt(i)==='"') looking = true;
          }
        }

        return str.split('`');
      }

    hashCode(s){
        return s.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
    }

    add_script(script){
        let hash = this.hashCode(script);
        if(this.scripts_hashes.indexOf(hash)!==-1) return;
        this.scripts_hashes.push(hash);

        let lines = this.splitPT(script);
        let whendo;
        for(var line of lines)
        {
            line = line.trim();
            if(line.startsWith('when'))
            {
                whendo = {
                    condition: line.replace('when','').replace(':','').trim(),
                    actions:[]
                }
                this.whendos.push(whendo);
                this.add_signal(whendo);
            }
            else if(whendo !== undefined && line!=="") {
                let ind = line.indexOf('=');
                whendo.actions.push({
                    lhs : line.substring(0, ind).trim(),
                    rhs: line.substring(ind+1, line.length).trim()
                })
            }
            else if(line!==""){
                let ind = line.indexOf('=');
                this.doAction({
                    lhs : line.substring(0, ind).trim(),
                    rhs: line.substring(ind+1, line.length).trim()
                });
            }
        }
    }
}

export let execution = new Execution();