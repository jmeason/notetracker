const express=require('express');
const fs = require('fs');
const path=require('path');
const db=require('./db/db.json');
const { v4: uuidv4 } = require('uuid'); //inport a specific function


const PORT=process.env.PORT || 3000;

const app=express (); //invoke express

app.use(express.json());
app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
    
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'))
});
app.get('/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            res.status(200).json(data);

        }
    });
});


app.post('/api/notes', (req, res)=> {
  console.info(`${req.method} request received to add a note`);
  
  const { title, text, } =req.body;
  if (title && text) {
   const newNote={
       title,
       text,
       id: uuidv4(),
       };
       fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
           if (err) {
               console.error(err);
               res.status(500).json('Error reading notes');
               return;
            }
            const notes = JSON.parse(data);
            notes.push(newNote);

    // writ the updated notes back to db.json
    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
        if (err) {
            console.error(err);
            return;
        }
        res.status(201).json(newNote);
    });
});
} else {
res.status(400).json('Invalid note data');
}
});

app.listen (()=> {
    console.log(`Express app is working on PORT: ${PORT}`)
} )