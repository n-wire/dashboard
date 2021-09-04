import React from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import {nw, Node} from 'nodewire';


const useStyles =  {
    root: {
        '& .MuiTextField-root': {
        margin: 'auto',
        width: '25ch',
        },
    },
};

class Console extends React.Component{
    constructor(){
        super();
        this.commands = [];
        this.current_command = -1;
        this.state = { code: '>>', history: '',  cursor: 2, min : 2 };
        this.handleKey = this.handleKey.bind(this);
        
        nw.onStart(()=>{
            this.terminal = new Node(nw.address); 
        });
    }

    rescriptevent(val){
        var hist = this.state.history;
        for(var vv in val)
            if(val !== '') hist += val[vv]+'\n';
        hist = hist.split('\n')
        if(hist.length>=50) hist = hist.slice(hist.length-50);
        this.setState({history: hist.join('\n')});
        this.setState({min: this.state.history.length+1});
        var textarea = document.getElementById('code');
        textarea.scrollTop = textarea.scrollHeight;
    };

    componentDidMount()
    {
        console.log('console mounted')
        document.getElementById('code').addEventListener('paste', (e) =>{
            var clipboardData, pastedData;

            // Stop data actually being pasted into div
            e.stopPropagation();
            e.preventDefault();

            // Get pasted data via clipboard API
            clipboardData = e.clipboardData || window.clipboardData;
            pastedData = clipboardData.getData('Text');

            this.setState({code: this.state.code.substring(0,this.state.cursor)+pastedData+this.state.code.substring(this.state.cursor, this.state.code.length), cursor: this.state.cursor+pastedData.length});
        });

        var textarea = document.getElementById('code');
        textarea.scrollTop = textarea.scrollHeight;
        nw.onStart(async ()=>{nw.when('ee.script', val=>{ this.rescriptevent(val) });})
    }

    componentWillUnmount(){
        nw.unsubscribe('ee.script', this.rescriptevent);
    }

    handleKey(event){
        if(event.key === "ArrowUp")
        {
            event.preventDefault();
            if(this.current_command>0)
            {
                this.current_command-=1;
                this.setState({code: '>>' + this.commands[this.current_command], cursor: this.commands[this.current_command].length+2});
            }
        }
        else if(event.key === "ArrowDown")
        {
            event.preventDefault();
            if(this.current_command<(this.commands.length-1))
            {
                this.current_command+=1;
                this.setState({code:  '>>' + this.commands[this.current_command], cursor: this.commands[this.current_command].length+2});
            }
        }
        else if(event.key === "Enter")
        {
            var cmd = this.state.code.substring(2, this.state.code.length);
            nw.send('ee set scriptlet "' + cmd.trim() + '" ' + nw.address);
            if(cmd.trim()!=="")
                this.commands.push(cmd.trim());
            this.current_command = this.commands.length;
            this.setState({history: this.state.history + this.state.code+'\n'});
            this.setState({code: '>>', cursor:2});
        }
        else if(event.key === "ArrowLeft")
        {
           if(this.state.cursor>2)
           {
              this.setState({cursor: this.state.cursor-1});
              //$('#code').setCursorPosition(this.state.cursor);
           }
        }
        else if(event.key === "ArrowRight" && this.state.code.length>2)
        {
           if(this.state.cursor<this.state.code.length)
           {
              this.setState({cursor: this.state.cursor+1});
              //$('#code').setCursorPosition(this.state.cursor);
           }
        }
        else if(event.key === "Backspace" && this.state.code.length>2 && this.state.cursor>2)
        {
           this.setState({code: this.state.code.substring(0,this.state.cursor-1)+this.state.code.substring(this.state.cursor, this.state.code.length), cursor: this.state.cursor-1});
           document.getElementById('code').setSelectionRange(this.state.cursor-1,this.state.cursor-1);
        }
        else if(event.key === "Del" && this.state.code.length>2 && this.state.cursor>2)
        {
           document.getElementById('code').setSelectionRange(this.state.cursor, this.state.cursor);
           this.setState({code: this.state.code.substring(0,this.state.cursor)+this.state.code.substring(this.state.cursor+1, this.state.code.length)});
        }
        else if(!event.metaKey && !event.ctrlKey && event.key.length===1)
        {
            //this.setState({code: this.state.code+event.key, cursor: this.state.cursor+1});
            //if(insert)
            //    this.setState({code: this.state.code.substring(0,this.state.cursor-1)+event.key+this.state.code.substring(this.state.cursor, this.state.code.length), cursor: this.state.cursor+1});
            //else
                this.setState({code: this.state.code.substring(0,this.state.cursor)+event.key+this.state.code.substring(this.state.cursor, this.state.code.length), cursor: this.state.cursor+1});
        }
        document.getElementById('code').focus();
        document.getElementById('code').selectionStart = this.state.history.length + this.state.cursor;
        document.getElementById('code').selectionEnd = document.getElementById('code').selectionStart;
    }


    render(){
        const { classes } = this.props;
        return (
            <form className={classes.root} noValidate autoComplete="off" style={{width:'100%', height:"100%", boxSizing: "border-box"}}>
              <div className="field" style={{width:'100%', height:"100%", boxSizing: "border-box"}}>
                <textarea variant="outlined" onKeyDown={this.handleKey} value={this.state.history+this.state.code} id="code" rows="6" style={{width:'100%', height:"100%", boxSizing: "border-box"}}></textarea>
              </div>
            </form>
        )
    }
};

Console.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Console);