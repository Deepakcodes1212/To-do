export function addNote(notes, note) {
    return [...notes, note];
}

export function deleteNote(notes, index) {
    const newNotes = [...notes];
    newNotes.splice(index, 1);
    return newNotes;
}