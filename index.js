const express = require("express");
const morgan = require("morgan")
const app = express();
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


app.use(express.json());

morgan.token('post-data', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  } else {
    return '';
  }
});
const myFormat = ':method :url :status :response-time ms :post-data'
app.use(morgan(myFormat))

// app.get("/", (request, response) => {
//   response.send("<h1>Hello world!</h1>");
// });

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(`Phonebook has info for ${persons.length} people
  <br /><br />
  ${new Date()}
  `);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const newID = Math.round(Math.random() * 1000000);
  return newID;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  let names = persons.map((person) => person.name);
  if (names.includes(body.name)) {
    return response.status(400).json({
      error: "name already existing",
    });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  //console.log(person);

  //persons = persons.concat(person);

  //response.json(persons);
  response.json(person);
});

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
