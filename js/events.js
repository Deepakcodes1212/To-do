import { addNote, deleteNote } from "./notes.js";
import { saveNotes } from "./storage.js";
import { renderNotes } from "./ui.js";

export function setupEvents(state) {
    const titleInput = document.getElementById("title");
    const thoughtInput = document.getElementById("thoughts");
    const addBtn = document.getElementById("upload-btn");
    const visibilitySelect = document.getElementById("visi1");
    const tagFilter = document.getElementById("tagFilter");
    const sortNotes = document.getElementById("sortNotes");
    const statusFilter = document.getElementById("statusFilter");
    const notesContainer = document.getElementById("notes_container");

    function saveAndRender() {
        saveNotes(state.notes);
        renderNotes(state.notes, state.selectedTag, state.sortOrder, state.filterStatus);
        updateTagFilter();
    }

    addBtn.addEventListener("click", () => {
        const title = titleInput.value.trim();
        const thought = thoughtInput.value.trim();
        
        if (!title || !thought) return;

        if (state.editIndex !== null) {
            const oldNote = state.notes[state.editIndex];
            const updatedNote = {
                ...oldNote,
                title,
                thought,
                visibility: visibilitySelect.value,
                tags: extractTags(thought)
            };
            const updatedNotes = [...state.notes];
            updatedNotes[state.editIndex] = updatedNote;
            state.notes = updatedNotes;
            state.editIndex = null;
        } else {
            const newNote = {
                title,
                thought,
                time: Date.now(),
                visibility: visibilitySelect.value,
                pinned: false,
                completed: false,
                tags: extractTags(thought)
            };
            state.notes = addNote(state.notes, newNote);
        }

        saveAndRender();
        titleInput.value = "";
        thoughtInput.value = "";
    });

    notesContainer.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const index = parseInt(e.target.dataset.index, 10);
            
            if (e.target.classList.contains("deleteBtn")) {
                state.notes = deleteNote(state.notes, index);
                saveAndRender();

            } else if (e.target.classList.contains("editBtn")) {
                const note = state.notes[index];
                titleInput.value = note.title;
                thoughtInput.value = note.thought;
                visibilitySelect.value = note.visibility;
                state.editIndex = index;

            } else if (e.target.classList.contains("pinBtn")) {
                const updatedNotes = [...state.notes];
                updatedNotes[index].pinned = !updatedNotes[index].pinned;
                state.notes = updatedNotes;
                saveAndRender();

            } else if (e.target.classList.contains("completeBtn")) {
                const updatedNotes = [...state.notes];
                updatedNotes[index].completed = !updatedNotes[index].completed;
                state.notes = updatedNotes;
                saveAndRender();
            }
        }
    });
    function extractTags(text) {
        const words = text.split(" ");
        return words
            .filter(word => word.startsWith("#"))
            .map(tag => tag.substring(1).toLowerCase());
    }

    function updateTagFilter() {
        const allTags = state.notes.flatMap(note => note.tags || []);
        const uniqueTags = [...new Set(allTags)];

        tagFilter.innerHTML = `<option value="all">All Tags</option>`;
        uniqueTags.forEach(tag => {
            const option = document.createElement("option");
            option.value = tag;
            option.textContent = `#${tag}`;
            tagFilter.appendChild(option);
        });
    }

    tagFilter.addEventListener("change", () => {
        state.selectedTag = tagFilter.value;
        saveAndRender();
    });

    sortNotes.addEventListener("change", () => {
        state.sortOrder = sortNotes.value;
        saveAndRender();
    });

    statusFilter.addEventListener("change", () => {
        state.filterStatus = statusFilter.value;
        saveAndRender();
    });

    const darkMode = document.querySelector(".mode");
    const body = document.body;
    let dark = false;

    darkMode.addEventListener("click", () => {
        body.style.backgroundColor = dark ? "" : "black";
        dark = !dark;
    });


    saveAndRender();
}