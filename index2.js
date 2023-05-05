const fs = require("fs/promises");
const express = require("express");
const cors = require("cors");
const _ = require("lodash");
const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());




////////////////////Directory///////////////////////////////////////////////////////////

//Ricerca del file
app.get("/nameFile/:id", async (req, res) => {
    const id = req.params.id;
    let content;

    try {
        content = await fs.readFile(`data/comments/${id}.txt`, "utf-8");
    } catch (err) {
        return res.sendStatus(404);
    }

    res.json({
        content: content
    });
});

//Cancellazione
app.get("/deleteFile/:id", async (req, res) => {
    const id = req.params.id;
    let content;

    try {
        content = await fs.unlink(`data/comments/${id}.txt`);
    } catch (err) {
        return res.sendStatus(404);
    }
    res.send("Il file è stato eliminato");
});


//Mostra file
app.get("/showFile", async (req, res) => {

    try {
        content = await fs.readdir(`data/comments`, "utf-8");
    } catch (err) {
        return res.sendStatus(404);
    }

    res.json({
        content: content
    });
});

//Creazione del file 
app.post("/newFile", async (req, res) => {
    const id = uuid();
    const content = req.body.content;

    if (!content) {
        return res.sendStatus(400);
    }

    try {
        await fs.mkdir("data/comments", { recursive: true });
        await fs.writeFile(`data/comments/${id}.txt`, content);
    } catch (err) {
        return res.sendStatus(400);
    }
    res.status(201).json({
        id: id
    });

});

//Rinomina di un file
app.get("/renameFile", async (req, res) => {
    const oldName = req.body.old;
    const newName = req.body.new;
    var msg;
    

    try {
        content = await fs.rename(`data/comments/${oldName}` + `.txt` , `data/comments/${newName}` + `.txt`);
        msg="La cartella è stata rinominata"
    } catch (err) {
        console.log("Errore");
        msg="La cartella non è stata rinominata"
    }
    res.status(201).json({
        nomeDirectory: msg
    });
});


//Modifica di un  file 
app.post("/updateFile", async (req, res) => {
   
    const nameFile = req.body.nameFile;
    const newcontent = req.body.newcontent;

    if (!newcontent) {
        return res.sendStatus(400);
    }

    try {
        await fs.writeFile(`data/comments/${nameFile}.txt`, newcontent);
    } catch (err) {
        return res.sendStatus(400);
    }
    res.status(201).json({
        content: newcontent
    });

});


////////////////////Directory///////////////////////////////////////////////////////////

//Creazione di una directory
app.post("/newDirectory", async (req, res) => {
    let content;
    let check=false;
    const nomeDirectory = req.body.nomeDirectory;
    try {

        content = await fs.readdir(`data`, "utf-8");
        console.log(content.length);
        for (let i = 0; i < content.length; i++) {
            msg="";
            console.log(content[i]);
            if (content[i] != nomeDirectory) {
                check=true;
                await fs.mkdir("data/" + nomeDirectory, { recursive: true });
                 msg="La creazione della directory è andata  a buon fine";
                 console.log("Ok");
            }else{
                return res.sendStatus(400);
            }
        }


    } catch (err) {
        return res.sendStatus(400);
    }
    console.log(check);
    res.status(201).json({
        nomeDirectory: msg
    });

});


//Mostra cartelle 
app.get("/showDirectory", async (req, res) => {

    try {
        content = await fs.readdir(`data`, "utf-8");
    } catch (err) {
        return res.sendStatus(404);
    }

    res.json({
        content: content
    });
});


//Elimina cartelle

app.get("/deleteDirectory/:name", async (req, res) => {
    const name = req.params.name;
    let content;
    console.log(name);

    try {
        content = await fs.rmdir(`data/`+ name);
    } catch (err) {
        return res.sendStatus(404);
    }
    res.send("La cartella è stata  eliminata");
});


//Rinonima cartella

app.get("/renameDirectory", async (req, res) => {
    const oldName = req.body.old;
    const newName = req.body.new;
    var msg;
    

    try {
        content = await fs.rename(`data/`+ oldName, `data/`+ newName);
        msg="La cartella è stata rinominata"
    } catch (err) {
        console.log("Errore");
        msg="La cartella non è stata rinominata"
    }
    res.status(201).json({
        nomeDirectory: msg
    });
});







app.listen(3000, () => console.log("API Server is running..."));