const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const schema = require('./schemas/rootSchema');

const mongoUri = 'mongodb://ajinomoto:ajinomoto@ds161304.mlab.com:61304/graphql-passport-auth';
mongoose.connect(mongoUri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('connected.'));

mongoose.Promise = global.Promise;

const app = express();

app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: 'ajinomoto',
  store: new MongoStore({
    url: mongoUri,
    autoReconnect: true
  })
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/graphql', bodyParser.json(), graphqlExpress(req => ({ schema, context: req })));
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphiql'));
