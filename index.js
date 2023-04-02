require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();
app.use(express.static("build"));
app.use(express.json());
app.use(cors());

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

//---------------------------------------------------------------------
// status message
morgan.token("post-data", (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else {
    return "";
  }
});
const myFormat = ":method :url :status :response-time ms :post-data";
app.use(morgan(myFormat));
//---------------------------------------------------------------------

app.get("/info", (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people
  <br /><br />
  ${new Date()}
  `);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});


app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  console.log('person',person)
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })

});


app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.use(unknownEndpoint);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
