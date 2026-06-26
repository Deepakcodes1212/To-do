import { addNote, deleteNote } from "./notes.js";
import { saveNotes } from "./storage.js";
import { renderNotes } from "./ui.js";

export function setupEvents(state) {

    const titleInput = document.getElementById("title");
    const thoughtInput = document.getElementById("thoughts");
    const addBtn = document.getElementById("upload-btn");
    const visibilitySelect = document.getElementById("visi1");
    const tagFilter=document.getElementById("tagFilter");
    const sortNotes=document.getElementById("sortNotes");

    
    addBtn.addEventListener("click", () => {

        const title = titleInput.value.trim();
        const thought = thoughtInput.value.trim();
        if(state.editIndex!==null){
            if(!title||!thought){
                return;
            }
           const oldNote=state.notes[state.editIndex];
           const updatedNote={
            ...oldNote,
            title,
            thought,
            time:oldNote.time,
            visibility:visibilitySelect.value,
            tags:extractTags(thought)
           }
           const  updatedNotes=[...state.notes];
           updatedNotes[state.editIndex]=updatedNote;
           state.notes=updatedNotes;

           saveNotes(state.notes);
           renderNotes(state.notes,handleDelete,handleEdit,handlePin,state.selectedTag,state.sortOrder);
           updateTagFilter();
           state.editIndex=null;
           
           titleInput.value = "";
           thoughtInput.value = "";
            


        }else{
            if (!title || !thought) return;

        const newNote = {
            title,
            thought,
            time: Date.now(),
            visibility: visibilitySelect.value,
            pinned:false, 
            tags:extractTags(thought)
        };

        state.notes = addNote(state.notes, newNote);
        saveNotes(state.notes);
        renderNotes(state.notes, handleDelete,handleEdit,handlePin,state.selectedTag,state.sortOrder);
        updateTagFilter()
        titleInput.value = "";
        thoughtInput.value = "";
            
        }

        
    });

    
    function handleDelete(index) {
        state.notes = deleteNote(state.notes, index);
        saveNotes(state.notes);
        renderNotes(state.notes, handleDelete,handleEdit,handlePin,state.selectedTag,state.sortOrder);
        updateTagFilter();
    }
    function handleEdit(index){
        const note=state.notes[index];

        titleInput.value=note.title;
        thoughtInput.value=note.thought;
        visibilitySelect.value=note.visibility;

        state.editIndex=index;
    }

    function handlePin(index){
        const updatedNotes=[...state.notes];

        updatedNotes[index].pinned=!updatedNotes[index].pinned;

        state.notes=updatedNotes;

        saveNotes(state.notes);
        renderNotes(state.notes,handleDelete,handleEdit,handlePin,state.selectedTag,state.sortOrder);
        updateTagFilter();
    }

    function extractTags(text){
        const words=text.split(" ");   
        return words
        .filter(word=>word.startsWith("#"))
        .map(tag=>tag.substring(1).toLowerCase());
    }

    function updateTagFilter(){
        const allTags=state.notes.flatMap(note=>note.tags || []);
        const uniqueTags =[...new Set(allTags)];

        tagFilter.innerHTML=`<option value="all">All Tags</option>`;
        uniqueTags.forEach(tag=>{
            const option =document.createElement("option");

            option.value=tag;
            option.textContent=`#${tag}`;

            tagFilter.appendChild(option);
        })
    }
     tagFilter.addEventListener("change",()=>{
            state.selectedTag=tagFilter.value;
            renderNotes(
                state.notes,
                handleDelete,
                handleEdit,
                handlePin,
                state.selectedTag,
                state.sortOrder
            );
        });
        sortNotes.addEventListener("change",()=>{

            state.sortOrder=sortNotes.value;
            renderNotes(
                state.notes,
                handleDelete,
                handleEdit,
                handlePin,
                state.selectedTag,
                state.sortOrder
            );
        });

    // 🌙 DARK MODE
    const darkMode = document.querySelector(".mode");
    const body = document.body;
    let dark = false;

    darkMode.addEventListener("click", () => {
        body.style.backgroundColor = dark ? "" : "black";
        dark = !dark;
    });
    renderNotes(state.notes,handleDelete,handleEdit,handlePin,state.selectedTag,state.sortOrder);
    updateTagFilter()
}