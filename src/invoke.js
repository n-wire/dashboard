import {nw} from 'nodewire'

async function invoke(func, json){
    let response = await fetch(window.location.protocol+'//' + nw.server + `:${process.env.REACT_APP_API_SERVER_PORT}/`+ func, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + nw.token
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(json)
    });
    try{
        response = await response.text();
        response = JSON.parse(response);
    }
    catch{}
    return response;
} 

export default invoke;