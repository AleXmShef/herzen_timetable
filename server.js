const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const favicon = require('serve-favicon');

const TimetableControllers = require('./controllers/timetable');


const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const timetable = require('./routes/api/timetable');
app.use('/api/timetable', timetable);



const updateDatabase = () => {
    axios.get('127.0.0.1:5000/api/timetable/all');
}


const herokuURL = 'https://herzen-timetable.herokuapp.com/';

//Server static assets if in production
if (process.env.NODE_ENV === 'production') {

    //Set static folder
    app.use(express.static('client/build'));

    //Serve favicon
    app.use(favicon(path.resolve(__dirname, 'client', 'build', 'img', 'favicon.ico')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });

    //Heroku anti shutdown request
    setInterval(async () => {
        try {
            const resp = await axios.get(herokuURL);
        } catch (err) {
            //Basically impossible to end up here
            console.error(err);
        }
    }, 120000);

    updateDatabase();
}

//probably we are on dev localhost
else {
    app.get('/', (req, res) => {
        res.send('Server working')
    });
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('Server started');
});