import invoke from '../../invoke';
import {nw} from 'nodewire'

export function loadProject(title) {
      return new Promise((resolve, reject) => {
        invoke('open_app', { appname: title }).then(app=>{
          if(typeof app === "object")
          {
            resolve(app);
          }
          else
          {
            reject(app);
          }
        }).catch(err=>reject(err));
        
      }
    );
  }

export function saveProject(project) {
  return new Promise((resolve, reject)=>{
      if(project.title==='') reject('please provide a valid project name')
      invoke('save_app', {app:project})
        .then(result=>{
          if(result==='success')
            resolve(result)
          else
            reject(result)
        })
        .catch(err=>reject(err))
    }
  );
}

export function addImage(file){
  return new Promise((resolve, reject)=>{
    var form_data = new FormData();
    form_data.append('files', file);

    for (var key of form_data.entries()) {
        console.log(key[0] + ', ' + key[1]);
    }

    console.log(file, form_data)

    fetch(window.location.protocol+'//' + nw.server + `:${process.env.REACT_APP_API_SERVER_PORT}/upload`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'include', // include, *same-origin, omit
        headers: {
        //'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + nw.token
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *client
        body: form_data,
    })
			.then((result) => {
        console.log(result);
				resolve(file.name);
			})
			.catch((error) => {
				reject(error);
			});
  })
}
  