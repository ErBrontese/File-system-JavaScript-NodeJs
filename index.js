const fs = require('fs/promises');
const fs2 = require('fs');
const path = require('path');
const express = require('express');
const _ = require('lodash');
const { v4: uuid } = require('uuid');
const app = express();






app.use(express.json());

app.get('/outfit', (req, res) => {
    const tops = ["Black", "White", "Blue", "Red", "Green"];
    const jeans = ["Black", "White", "Dark Grey", "Red", "Dark Green"];
    const shoes = ["Black", "Dark White", "Grey", "Red", "Green"];


    res.json({
        top: _.sample(tops),
        jeans: _.sample(jeans),
        shoes: _.sample(shoes)
    });


})



app.get('/comments/:id', async (req, res) => {
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

})

app.post('/comments', async (req, res) => {
    const id = uuid();
    console.log(id);
    const content = req.body.content

    if (!content) {
        return res.sendStatus(400);

    }
    await fs.mkdir("data/comments", { recursive: true });
    //Percorso del file, messaggio che vogliamo inserire
    await fs.writeFile("data/comments/" + id + ".txt", content);

    fs2.promises.readdir(path.join(__dirname, 'data/comments'))
        .then(filenames => {
            for (let filename of filenames) {
                if (filename == "3c439e77-ad24-45a5-9a70-5bb0e5c0135f.txt") {
                    fs.unlink('data/comments/3c439e77-ad24-45a5-9a70-5bb0e5c0135f.txt', (err) => {
                        if (err) throw err;
                        console.log('path/file.txt was deleted');
                    });
                }
            }
        })
        // If promise is rejected
        .catch(err => {
            console.log(err)
        })
});


app.get('/show', (req, res) => {
    let variabile = new Array();
    let ArraySend = new Array();
    let someFolder = "data/comments";

    fs2.promises.readdir("data/comments")


        .then(filenames => {
            for (let filename of filenames) {
                
                variabile.push(filename);
            }
            for (let i = 0; i < variabile.length; i++) {

                fs2.promises.readFile(`data/comments/${variabile[i]}`, "utf-8").then(content => {
                   ArraySend.push(content)


                   if(i>variabile.length){
                    res.send(ArraySend);
                   }
                   
                }).catch((err) => { console.log("error") })
            }
        })
        .catch(err => {
            console.log(err)
        })









})



app.listen(8080, () => console.log("Listening on port 8080"));