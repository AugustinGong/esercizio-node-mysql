const express = require('express');
const mysql = require('mysql');
const session = require('express-session');

const path = require('path');
const { redirect } = require('express/lib/response');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'august',
    database: 'esercizio-3'
});

const app = express();


app.use(session({
    secret: 'secret'
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname + '/register.html'));
})



app.post('/auth', (request, response) => {

    let email = request.body.inputEmail;
    let password = request.body.inputPassword;

    if (email && password) {
        console.log("dentro if")
        connection.query("SELECT * FROM persona WHERE email = '" + email + "' AND password = '" + password + "'",
            (error, result) => {

                if (error) throw error;

                if (result.length > 0) {

                    request.session.control = true;
                    request.session.email = email;
                    response.redirect('/home');
                }
                else {
                    request.session.control = false;
                    response.redirect('/home');
                }
                response.end();
            });

    } else {

        response.send('Inserire entrambi i campi');
        response.end();
    }
});
app.post('/reg', (request, response) => {
    
    let nome = request.body.inputNome;
    let cognome = request.body.inputCognome;
    let dataNascita = request.body.inputNascita
    let email = request.body.inputEmail;
    let password = request.body.inputPassword;

    if (email && password) {
        console.log("dentro if")
        let myQuery = `INSERT INTO persona (nome, cognome, dataNascita, email, password) values ('${nome}', '${cognome}', '${dataNascita}', '${email}', '${password}')`
        connection.query(myQuery, (error, result) => {

                if (error) throw error;

                if (result.length > 0) {

                    request.session.control = true;
                    request.session.email = email;
                    response.redirect('/homepage');
                }
                else {
                    request.session.control = false;
                    response.redirect('/homepage');
                }
                response.end();
            });

    } else {

        response.send('Inserire entrambi i campi');
        response.end();
    }
});

app.get('/home', (request, response) => {
    if (request.session.control) {
        response.send('Benvenuto ' + request.session.email + ' !');
    } else {
        response.redirect('/register')

    }
    response.end();


});
app.get('/homepage', (request, response) => {
    if (request.session.control) {
        response.sendFile(path.join(__dirname + '/home.html'));
        response.send('Benvenuto ' + request.session.email + ' !');
    } 
    response.end();


});

app.listen(3000);