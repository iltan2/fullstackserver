const mongoose = require("mongoose");

if (
  process.argv.length < 3 ||
  process.argv.length === 4 ||
  process.argv.length > 5
) {
  console.log(
    "input format as follows: node mongo.js [password] [name] [number]"
  );
  console.log("or node mongo.js [password]");
  console.log("if name has space, enclose them in double-quotes");
  process.exit(1);
}

const password = process.argv[2];
let newName = null;
let newNumber = null;

if (process.argv.length > 4) {
  newName = process.argv[3];
  newNumber = process.argv[4];
}
const url = `mongodb+srv://israeltan2:${password}@cluster0.chrkupj.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (newName !== null && newNumber !== null) {
  const person = new Person({
    name: newName,
    important: newNumber,
  });

  person.save().then((result) => {
    console.log(`added ${newName} ${newNumber} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((persons) => {
    console.log(persons);
    mongoose.connection.close();
  });
}
