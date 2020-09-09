const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const timetable = require('./routes/api/timetable');

app.use('/api/timetable', timetable);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });

    //Heroku anti shutdown request
    setInterval(async () => {
        try {
            const resp = await axios.get("https://spbu-campus-maps.herokuapp.com/");
        } catch (err) {
            //Basically impossible to end up here
            console.error(err);
        }
    }, 120000);
} else {
    app.get('/', (req, res) => {
        res.send('Fuck you')
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('Server started');
});