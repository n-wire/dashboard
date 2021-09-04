import React, { Component } from 'react';
import {nw, Node} from 'nodewire';

var thenode;
 
class Controller extends Component {
    state = {count:0, waiting: true}
    componentDidMount(){
        console.log('controller mounted?')
        const initialize = async () =>  {
            console.log('controller inited')
            this.me = new Node('controller');
            thenode = await this.me.getNode('mynode'); 
            this.setState({waiting: false, count: thenode.count});
            thenode.setHandler({
                onCount: val => {
                    this.setState({count: val});
                }
            })
        }
        nw.onStart(initialize);
    }

    componentWillUnmount(){
        this.me.stop();
    }

    render() {
        if(this.state.waiting)
            return (
                <div>
                    Wait ...
                </div>
            )
        return (
            <div>
                <div>
                    {this.state.count}
                </div>
                <button onClick={()=>{
                    thenode.start = 1;
                }}>Start</button>
                <button onClick={()=>{
                    thenode.start = 0;
                }}>Stop</button>
                <button onClick={()=>{
                    thenode.reset = 0;
                }}>Reset</button>
            </div>
        );
    }
}
 
export default Controller;