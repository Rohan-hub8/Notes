const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    fs.readdir("./files", (err, files) => {
        res.render("index", { files: files });
    });
});

app.get("/note/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
        res.render("note", { filename: req.params.filename, filedata: filedata });
    });
});

app.get("/edit/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata) => {
        res.render("edit", { filename: req.params.filename, filedata: filedata });
    });
});

app.post("/create", (req, res) => {
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`, req.body.detail, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return res.status(500).send('Error creating file');
        }
        res.redirect("/");
    });
});

app.post("/edit/:filename", (req, res) => {
    fs.rename(`./files/${req.params.filename}`, `./files/${req.body.newTitle.split(' ').join('')}.txt`, (err) => {
        if (err) {
            return res.status(500).json({ message: "Error rename file!" });
        }
    });

    fs.writeFile(`./files/${req.params.filename}`, req.body.newDetail, "utf8", (err) => {
        if (err) {
            return res.status(500).json({ message: "Error saving file!" });
        }
        res.redirect(`/note/${req.body.newTitle.split(' ').join('')}.txt`);
    });
});

app.post("/delete/:filename", (req, res) => {
    fs.unlink(`./files/${req.params.filename}`, (err) => {
        res.redirect("/");
    });
});


app.listen(3000);

