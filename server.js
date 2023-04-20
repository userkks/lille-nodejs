const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const mongoDbStore = require('connect-mongodb-session')(session);
require('./auth');

const cors = require('cors');
const keys = require('./keys');
const app = express();
const path = require('path');

mongoose.connect(keys.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to mongo db'));

// app.use(cors());             // for production purpose use
app.use(keys.environment === 'PROD' ? cors() : cors({ origin: "http://localhost:4200", credentials: true }));       // for development purpose only
app.use(express.json());

const sessionStore = new mongoDbStore({
    uri: keys.DATABASE_URL,
    collection: "userSession",
});

app.use(session({...keys.SESSION_CONFIGURATION, store: sessionStore}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api', require('./routers/apiRouter'));    // for all public created api
app.use('/utility', require('./routers/utilityRouter'));    // for all utility apis
app.use(`/${keys.CUSTOM_API_ROOT}`, require('./routers/customApiRouter'));          // for all user created apis

app.use(express.static('dist/angular-project'));

app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/angular-project/assets/robots.txt'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/angular-project/index.html'));
});

app.listen(3000);