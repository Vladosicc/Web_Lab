// Require packages and set the port
const express = require('express');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const routes = require('./routes/routes');
const MongoClient = require('mongodb').MongoClient;
const db = require('./config/db');
var cors = require('cors');
const app = express();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { request } = require('express');
const MongoStore = require('connect-mongo');
const path = require('path');

const mongoClient = new MongoClient(db.url, { useUnifiedTopology: true });

app.use(express.static(path.join(__dirname, '/public')));
// Use Node.js body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(cors());

app.use(cookieParser());

app.use(session({
    secret: "nonsecret",
    key: "sid",
    cookie: {
        path: "/",
        httpOnly: true,
        maxAge: null
    },
    store: MongoStore.create({mongoUrl: db.url})
}));

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'public'));


mongoClient.connect(function(err, client){
    if(err) return console.log(err);
    routes(app, client);
    const server = app.listen(port, (error) => {
        if (error) return console.log(`Error: ${error}`);
    
        console.log(`Server listening on port ${server.address().port}`);
    });
});

/*
// Start the server
const server = app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);

    console.log(`Server listening on port ${server.address().port}`);
});*/