require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const schema = require('./schemas/rootSchema');

const mongoUri = process.env.MONGO_URI;
const nodePort = process.env.NODE_PORT;
mongoose.connect(mongoUri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => console.log('mongo connected.'));

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
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.listen(nodePort, () => console.log(`Now browse to http://localhost:${nodePort}/graphiql`));
