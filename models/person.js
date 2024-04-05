const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery', false);
mongoose.connect(url)
    .then(result => console.log('DB connection sucessfull!'))
    .catch(error => console.log('Error connecting to MongoDB: ',error.message));

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: {
            validator: function(v){
                return /\d{2,3}-\d{5,9}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
        },
        required: true
    }});

personSchema.set('toJSON', {
    transform: (document, returndedObject) => {
        returndedObject.id = returndedObject._id.toString();
        delete returndedObject._id;
        delete returndedObject.__v;
    }
});

module.exports = mongoose.model('Person', personSchema);
