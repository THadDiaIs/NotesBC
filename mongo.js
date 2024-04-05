const mongoose = require("mongoose");


if (process.argv.length < 3){
  console.log("password not passed as argument");
  process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://sdia7sdia:${encodeURIComponent(password)}@dnn0.k280uaz.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Dnn0`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const personSchema = new mongoose.Schema({ name: String, number: String });
// const Person = new mongoose.model('Person', personSchema);
const Person = mongoose.model("'Person", personSchema);

if (process.argv.length < 4){
  Person.find({}).then(result => {
    console.log("Phonebook:")
    result.forEach(person => {
      console.log(`${person.name} : ${person.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  person.save().then(result => {
    console.log(`Added ${person.name} with number ${person.number} to phonebook!`);
    mongoose.connection.close();
  });
}



