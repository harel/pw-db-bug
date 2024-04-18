document.addEventListener('DOMContentLoaded', onDocumentLoaded, false);

let DB;
let DATABASE_NAME = 'MYDB';
const dbRequest = window.indexedDB.open(DATABASE_NAME);

dbRequest.onerror = function (event) {
    console.error(`Could not open local database: ${event.target.error}`)
}
dbRequest.onsuccess = function (event) {
    DB = dbRequest.result;
    try {
        loadUploads();
    } catch (e) {
    }
}
dbRequest.onupgradeneeded = function (event) {
    createDatabase(event.target.result)
}

function createDatabase(db) {
    console.log("Creating database stores", db)
    db.createObjectStore('mydata', { keyPath: 'id', autoIncrement: true });
}

function addRow() {
    const transaction = DB.transaction(['mydata'], 'readwrite');
    transaction.objectStore('mydata').add({
        name: "A new record!"
    }).onsuccess = ({ target: { result } }) => {
        console.log("Row inserted")
    }
}

function onDocumentLoaded() {
    document.getElementById('process').addEventListener('click', addRow);
}