const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.pwgovse.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const dbMaker = async () => {
  try {
    const productsCollection = client
      .db(`${process.env.DB_NAME}`)
      .collection("products");
    app.get("/products", async (req, res) => {
      const query = {};
      const productsData = productsCollection.find(query);
      const count = await productsCollection.estimatedDocumentCount();
      const products = await productsData.toArray();
      res.send({ count, products });
    });
  } catch (error) {}
};

app.get("/", (req, res) => {
  res.send("server is running on port " + port);
});
dbMaker().catch((err) => console.log(err));
app.listen(port, () => {
  console.log("server is running on port " + port);
});
