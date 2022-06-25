const express = require("express");
const { graphqlHTTP } = require("express-graphql");
var dotenv = require("dotenv");

const schema = require("./schema/schema");
const testSchema = require("./schema/types_schema");
const mongoose = require("mongoose");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
    "/graphql",
    graphqlHTTP({
        graphiql: true,
        schema: schema,
    })
);
app.use(cors());

var url = process.env.MONGO_URI;
mongoose
    .connect(url)
    .then(() => {
        app.listen({ port: port }, () => {
            console.log(`Listening on port ${port}`);
        });
    })
    .catch((e) => {
        console.log(e);
    });