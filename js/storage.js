export function loadNotes() {
    return JSON.parse(localStorage.getItem("notesDiv")) || [];
}

export function saveNotes(notes) {
    localStorage.setItem("notesDiv", JSON.stringify(notes));
}