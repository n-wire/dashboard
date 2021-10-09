import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loadProject, saveProject, addImage, deleteImage } from './developAPI';

export const loadProjectAsync = createAsyncThunk(
    'develop/loadProject',
    async (title) => {
      const response = await loadProject(title);
      return response;
    }
);

export const saveProjectAsync = createAsyncThunk(
    'develop/saveProject',
    async (project) => {
      const response = await saveProject(project);
      return response;
    }
);

export const addImageAsync = createAsyncThunk(
  'develop/addImage',
  async (file) => {
    const response = await addImage(file);
    return response;
  }
);

export const deleteImageAsync = createAsyncThunk(
  'develop/deleteImage',
  async (filename) => {
    const response = await deleteImage(filename);
    return response;
  }
);

export const developSlice = createSlice({
  name: 'develop',
  initialState:{
    status: '',
    project: {
        title: '',
        pages: [],
        sketches: [],
        images: []
    },
    openFiles:[],
    activeFileIndex: 0
  },
  reducers: {
    newProject: (state, action) =>{
      state.project = {
        title: '',
        pages: [],
        sketches: [],
        images: []
      };
      state.openFiles = [];
      state.activeFileIndex = 0;
    },
    addFile: (state, action) => {
        if( state.project[action.payload.type].findIndex(file=>file.name===action.payload.name)===-1)
            state.project[action.payload.type].push({
              name: action.payload.name,
              content: '',
              type: action.payload.type
            });
        else
            state.status = {
              severity: "error",
              message: `There is already a file named '${action.payload.name}'`
            }
    },
    deleteFile: (state, action) => {
      let index = state.project[action.payload.type].findIndex(file=>file.name===action.payload.name);
      state.project[action.payload.type].splice(index, 1);
    },
    updateFile: (state, action) => {
        try{
            let index = state.project[action.payload.type].findIndex(file=>file.name===action.payload.name);
            if(index!==-1)
                state.project[action.payload.type][index].content = action.payload.content;
            //todo refactor this, single source of truth
            index = state.openFiles.findIndex(file=>file.name===action.payload.name);
            if(index!==-1)
                state.openFiles[index].content = action.payload.content;
        }
        catch{

        }
    },
    openFile: (state, action) => {
        let index = state.project[action.payload.type].findIndex(file=>file.name===action.payload.name);
        try{
          //for a strange reason, we sometimes get an undefined entry in state.openFiles. This exception handles that.
          let index2 = state.openFiles.findIndex(file=>file.name===action.payload.name);
          if(index2===-1)
          {
              state.openFiles.push(state.project[action.payload.type][index]);
              state.activeFileIndex = state.openFiles.length-1;
          }
          else
              state.activeFileIndex = index2;
        }
        catch{
          state.activeFileIndex = -1;
          state.openFiles = [];
          state.status = {
            message: 'failed to open file. Please try again by clicking on the filename one more time',
            severity: 'info'
          }
        }
    },
    closeFile: (state, action) => {
        let index = state.openFiles.findIndex(file=>file.name===action.payload.name);
        if(index!==-1) {
            if(index<=state.activeFileIndex && index!==0) state.activeFileIndex-=1
            state.openFiles.splice(index,1);
        }
    },
    setActiveFile: (state, action) => {
        state.activeFileIndex = action.payload;
    },
    setStatus: (state, action) => {
        state.status = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProjectAsync.pending, (state) => {
        state.status = {message:'loading...', severity:'info'};
      })
      .addCase(loadProjectAsync.fulfilled, (state, action) => {
        state.status = {message:'loaded', severity:'success'};
        state.project = action.payload;
        state.openFiles.length = 0;
        state.activeFileIndex = -1;
      }).addCase(loadProjectAsync.rejected, (state, action) => {
        state.status ={message:action.error.message, severity:'error'};
      }).addCase(saveProjectAsync.pending, (state) => {
        state.status = {message:'saving...', severity:'info'};
      })
      .addCase(saveProjectAsync.fulfilled, (state, action) => {
        state.status = {message:'saved', severity:'success'};
      }).addCase(saveProjectAsync.rejected, (state, action) => {
        state.status = {message:action.error.message, severity:'error'};;
      }).addCase(addImageAsync.pending, (state) => {
        state.status = {message:'uploading...', severity:'info'};
      })
      .addCase(addImageAsync.fulfilled, (state, action) => {
        state.status = {message:'uploaded', severity:'success'};
        if(state.project['images'].indexOf(action.payload)===-1)
          state.project['images'].push({
            name: action.payload
          })
      }).addCase(addImageAsync.rejected, (state, action) => {
        state.status = {message:action.error.message, severity:'error'};
      }).addCase(deleteImageAsync.pending, (state) => {
        state.status = {message:'deleting...', severity:'info'};
      })
      .addCase(deleteImageAsync.fulfilled, (state, action) => {
        state.status = {message:'deleted', severity:'success'};
        let index = state.project['images'].findIndex(file=>file.name===action.payload.name);
        state.project['images'].splice(index, 1);
      }).addCase(deleteImageAsync.rejected, (state, action) => {
        state.status = {message:action.error.message, severity:'error'};
      });
  },
});

export const { newProject, addFile, deleteFile, openFile, updateFile, closeFile, setStatus, setActiveFile } = developSlice.actions;
export const selectProject = (state) => state.develop.project;
export const selectOpenFiles = (state) => state.develop.openFiles;
export const selectActiveFileIndex = (state) => state.develop.activeFileIndex;
export const selectStatus = (state) => state.develop.status;
export default developSlice.reducer;