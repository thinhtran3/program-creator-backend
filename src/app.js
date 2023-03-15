const compress = require("compression");
const helmet = require("helmet");
const cors = require("cors");
const logger = require("./logger");
const web3 = require("./web3");

const { feathers } = require("@feathersjs/feathers");
const configuration = require("@feathersjs/configuration");
const express = require("@feathersjs/express");
const socketio = require("@feathersjs/socketio");
const swagger = require("feathers-swagger");

const middleware = require("./middleware");
const services = require("./services");
const appHooks = require("./app.hooks");
const channels = require("./channels");

// const authentication = require('./authentication');

// const mongoose = require('./mongoose');

const sequelize = require("./sequelize");
// const prometheus = require('./prometheus')

const redisCache = require("feathers-redis-cache");

const knex = require("./knex");

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Host the public folder
app.use("/", express.static(app.get("public")));

// swagger
app.configure(
  swagger({
    ui: swagger.swaggerUI({ docsPath: "/docs" }),
  })
);

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

// app.configure(mongoose);
// app.configure(prometheus)

app.configure(sequelize);
app.configure(redisCache.client({ errorLogger: logger.error }));

app.configure(knex);
app.configure(web3);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
// app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);

module.exports = app;
