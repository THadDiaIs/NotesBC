const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url)
    .then(result => console.log('DB connection sucessfull!'))
    .catch(error => console.log('Error connecting to MongoDB: ',error.message));

const personSchema = new mongoose.Schema({ name: String, number: String });
const Person = mongoose.model('Person', personSchema);

personSchema.set('toJSON', {
    transform: (document, returndedObject) => {
        returndedObject.id = returndedObject._id.toString();
        delete returndedObject._id;
        delete returndedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);
