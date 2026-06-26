export function renderNotes(notes, onDelete,onEdit,onPin,selectedTag,sortOrder) {
    const notesShow = document.getElementById("notes_container");
    notesShow.innerHTML = "";
    
    let filteredNotes=notes;
        if(selectedTag!=="all"){
            filteredNotes=notes.filter(note=>
            (note.tags||[]).includes(selectedTag)
            );
        }
        const sortedNotes=[...filteredNotes].sort((a,b)=>{
            if(a.pinned!==b.pinned){
                return b.pinned-a.pinned;
            }
            if(sortOrder==="newest"){
                return b.time -a.time;
            }else{
                return a.time -b.time;
            }
        }

        );

    sortedNotes.forEach((note) => {
        const index=notes.indexOf(note);

        const notesDiv = document.createElement("div");
        notesDiv.classList.add("note123");

        const TitleEl = document.createElement("h3");
        TitleEl.textContent = note.title;

        const paraEl = document.createElement("p");

        const maxLength = 30;
        let previewText = note.thought;

        if (note.thought.length > maxLength) {
            previewText = note.thought.slice(0, maxLength) + "...";
        }

        let expanded = false;
        paraEl.textContent = previewText;

        paraEl.addEventListener("click", function () {
            paraEl.textContent = expanded ? previewText : note.thought;
            expanded = !expanded;
        });


        const time = document.createElement("small");
        time.textContent = new Date(note.time).toLocaleString();

        const visi2 = document.createElement("small");
        visi2.textContent = note.visibility;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("deleteBtn");

        const pinBtn=document.createElement("button");
        pinBtn.textContent=note.pinned?"Unpin":"Pin";
        pinBtn.classList.add("pinBtn");

        const editBtn=document.createElement("button");
        editBtn.textContent="Edit";
        editBtn.classList.add("editBtn");

        const tagsEl=document.createElement("div");
        tagsEl.textContent=(note.tags ||[]).map(tag=>`#${tag}`).join(" ");

    

        // 🔥 IMPORTANT: call external function
        deleteBtn.addEventListener("click", () => onDelete(index));

        editBtn.addEventListener("click",()=>onEdit(index));

        pinBtn.addEventListener("click",()=>onPin(index));




        notesDiv.append(TitleEl, paraEl,tagsEl, time, visi2, deleteBtn,editBtn,pinBtn);
        notesShow.appendChild(notesDiv);
    });
}