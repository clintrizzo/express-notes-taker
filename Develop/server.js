const express = require("express");
const path = require("path");
const fs = require("fs");
const e = require("express");

const notes = express();
const PORT = 9005;
const mainDirectory = path.join(__dirname, "/public");

notes.use(express.static("public"));
//from activities folder
notes.use(express.urlencoded({ extended: true }));
notes.use(express.json());

notes.get("/notes", function(req, res) {
    res.sendFile(path.join(mainDirectory, "notes.html"));
});

notes.get("/api/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./db/db"))
});

notes.get("/api/notes/:id", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db", "utf8"));
    res.json(savedNotes[Number(req.params.id)]);
});

notes.get("*", function(req, res) {
    res.sendFile(path.join(mainDirectory, "notes.html"));
});

notes.post("/api/notes", function(req, res) {
    let savedNotes = JSON.parse(fs.readFileSync("./db/db", "utf8"));
    //https://www.geeksforgeeks.org/express-js-req-body-property/
    let newNote = req.body;
    let uniqueID = (savedNotes.length).toString();
    newNote.id = uniqueID;
    savedNotes.push(newNote);

    fs.writeFileSync("./db/db", JSON.stringify(savedNotes));
    console.log("Note was saved", newNote);
    res.json(savedNotes);
})

//console logging for the return if no errors to tell user the port is active
notes.listen(PORT, function() {
    console.log(`App is listening on PORT ${PORT}`)
})