import express from "express";
import routes from './routes';

const app = express();

app.get("/", (request, response) => response.json({ message: "Ola" }));

app.listen(3333, () => {
  console.log("Server start on 3333");
});
