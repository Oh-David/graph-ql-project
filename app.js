const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./schema/schema");
const testSchema = require("./schema/types_schema");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 4000;
const cors = require("cors");

//mongodb+srv://davidwants2learn:hydroxide2@udemy.4c3yaha.mongodb.net/?retryWrites=true&w=majority

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);

mongoose
  .connect(
    `mongodb+srv://${process.env.mongoUserName}:${process.env.mongoPassword}@udemy.4c3yaha.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    app.listen({ port: port }, () => {
      console.log("Listening for request on port " + port);
    });
  })
  .catch((e) => console.log("Error:::" + e));
