import { loadNotes } from "./storage.js";
import { renderNotes } from "./ui.js";
import { setupEvents } from "./events.js";

const state = {
    notes: loadNotes(),
    editIndex:null,
    selectedTag:"all",
    sortOrder:"newest"
};
setupEvents(state);