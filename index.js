const express = require("express")
const bodyparser = require("body-parser")
const mysql = require("mysql")


  
const app = express();
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

const porta = 3000;
const host = "localhost";

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password: 'august',
    database: 'esercizio-3'
});

app.listen(porta, host, () => {
    console.log(`Sono connesso all'indirizzo http://${host}:${porta}`)
})

connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
  
    console.log('connected as id ' + connection.threadId);
});


// http://localhost:3000/stud/lista
app.get("/lib/lista", (req, res) => {
    connection.query("SELECT * FROM libri", (errore, risultato, campi)=>{
        if(!errore)
            res.json(risultato);
        else
            res.json({
                status: "error",
                data: errore.sqlMessage
            })
    })
})

app.post("/lib/inserisci",  (req, res) => {
    
    let libro = {
        autore : req.body.aut,
        titolo : req.body.tit,
        isbn : req.body.isb
    }

    connection.query(`INSERT INTO libri (titolo, autore, isbn) 
        VALUES ('${libro.titolo}', '${libro.autore}', '${libro.isbn}')`, (errore, risultato, campi)=>{
            if(!errore)
                res.json(risultato);
            else
                res.json({
                    status: "error",
                    data: errore.sqlMessage
                })

        })
})


app.get("/lib/:isbn", (req, res) => {

    connection.query(`SELECT * FROM libri WHERE isbn = '${req.params.isbn}'`, (errore, risultato, campi)=>{
        if(!errore)
            res.json(risultato);
        else
            res.json({
                status: "error",
                data: errore.sqlMessage
            })
    })
})

app.delete("/lib/delete/:isbn", (req, res) => {

    connection.query(`DELETE FROM libri WHERE isbn = '${req.params.isbn}'`, (errore, risultato, campi)=>{
        if(!errore)
            res.json(risultato);
        else
            res.json({
                status: "error",
                data: errore.sqlMessage
            })
    })
})

app.put("/lib/update/:isbn", (req, res) => {

    let libro = {
        titolo : req.body.tit,
        autore : req.body.aut,
        isbn : req.body.isb
    }

    connection.query(`UPDATE libri SET titolo = '${libro.titolo}', autore = '${libro.autore}', isbn = '${libro.isbn}' WHERE isbn = '${req.params.isbn}'`, (errore, risultato, campi)=>{
        if(!errore)
            res.json(risultato);
        else
            res.json({
                status: "error",
                data: errore.sqlMessage
            })
    })
})