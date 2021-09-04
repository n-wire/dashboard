import React, { useState, useEffect } from 'react';
import {nw, Node} from 'nodewire';

var thenode;
function Controller() {
    const [count, setCount] = useState(0);
    const [waiting, setWaiting] = useState(true);
    
    useEffect(() => {
        const me = new Node('controller');
        async function initialize(){
            try{
                thenode = await me.getNode('mynode'); 
                setCount(thenode.count);
                setWaiting(false);
                thenode.setHandler({
                    onCount: val => {
                        setCount(val);
                    }
                })
            }
            catch{
                //alert('Failed to get node')
            }
        }
        nw.onStart(initialize);
        return ()=>me.stop();
    }, []);

    if(waiting)
        return (
            <div>
                Wait ...
            </div>
        )
    return (
        <div>
            <div>
               The Count is: {count}
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
export default Controller;