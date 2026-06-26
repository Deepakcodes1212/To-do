export function renderNotes(notes, selectedTag, sortOrder, filterStatus) {
    const notesShow = document.getElementById("notes_container");
    notesShow.innerHTML = "";
    

    let filteredNotes = notes;
    if (filterStatus === "active") {
        filteredNotes = notes.filter(note => !note.completed);
    } else if (filterStatus === "completed") {
        filteredNotes = notes.filter(note => note.completed);
    }

    if (selectedTag !== "all") {
        filteredNotes = filteredNotes.filter(note => (note.tags || []).includes(selectedTag));
    }
    

    const sortedNotes = [...filteredNotes].sort((a, b) => {
        if (a.pinned !== b.pinned) {
            return b.pinned - a.pinned;
        }
        if (sortOrder === "newest") {
            return b.time - a.time;
        } else {
            return a.time - b.time;
        }
    });

    sortedNotes.forEach((note) => {
        const index = notes.indexOf(note); 

        const notesDiv = document.createElement("div");
        notesDiv.classList.add("note123");
        
        if (note.completed) {
            notesDiv.style.opacity = "0.5"; 
        }

        const TitleEl = document.createElement("h3");
        TitleEl.textContent = note.completed ? `✅ ${note.title}` : note.title;

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

        const tagsEl = document.createElement("div");
        tagsEl.textContent = (note.tags || []).map(tag => `#${tag}`).join(" ");

       
        const completeBtn = document.createElement("button");
        completeBtn.textContent = note.completed ? "Mark Active" : "Mark Complete";
        completeBtn.classList.add("completeBtn");
        completeBtn.dataset.index = index;

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("editBtn");
        editBtn.dataset.index = index;

        const pinBtn = document.createElement("button");
        pinBtn.textContent = note.pinned ? "Unpin" : "Pin";
        pinBtn.classList.add("pinBtn");
        pinBtn.dataset.index = index;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.dataset.index = index;

        notesDiv.append(TitleEl, paraEl, tagsEl, time, visi2, completeBtn, editBtn, pinBtn, deleteBtn);
        notesShow.appendChild(notesDiv);
    });
}