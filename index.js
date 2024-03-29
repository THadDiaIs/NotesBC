require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();

morgan.token('req-content', req => req.body ? JSON.stringify(req.body) : " ");

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-content"));


app.get("/info", (req, resp) => {
    Person.find({}).then(result => {
    resp.send(`<h1 style='
    background-color:black;
    color:white;
    text-align:center;
    padding:1em'>
    This is the phonebook API</h1>
    <p>There are actually, ${result.length} persons in the phonebook.</p>
    <footer style='
    width:100%;
    text-align:center;
    background-color:gray;
    color:white'>${new Date()}</footer>`)
    })
});

app.get("/api/persons", (req, resp) => {
    Person.find({}).then(result => resp.json(result));
})

app.get("/api/persons/:id", (req, resp, next) => {
    Person.findById(req.params.id)
        .then(person => resp.json(person))
        .catch(error => next(error));
});

app.delete("/api/persons/:id", (req, resp, next) => {
    Person.findByIdAndDelete(req.params.id).
        then(result => resp.status(204).end())
        .catch(error => next(error));
});

app.post("/api/persons", (req, resp) => {
    const data = req.body;
    if (!data.name || !data.number) {
        return resp.status(400).json({
            error: 'content missing'
        });
    }
    // if (persons.some(prsn => prsn.name === data.name)){
    //     return resp.status(400).json({
    //         error: 'this name alaready exists'
    //     })
    // }
    // if (persons.some(prsn => prsn.number === data.number)){
    //     return resp.status(400).json({
    //         error: 'this number alaready exists'
    //     })
    // }
    const person =  new Person({
        //    id : Math.floor(Math.random(0,100000000000)*100000000000),
        name : data.name,
        number: data.number
    });

    person.save()
        .then(svdPrsn => resp.json(svdPrsn));
});

app.put("/api/persons/:id", (req, resp, next) => {
    const {name, number} = req.body;
    Person.findByIdAndUpdate(req.params.id, {name, number}, { new : true})
    .then(updatedPerson => resp.json(updatedPerson))
    .catch(error => next(error));
});

const unknownEndpoint = (req, resp) => {
    resp.status(404).send({ error: 'unknown endpoint' });
}
app.use(unknownEndpoint);

const errorHandler = (error, req, resp, next) =>{
    console.log(error);
    if (error.name === 'CastError'){
        return resp.status(400).send({ error: 'mlformatted id'});
    }
    next(error);
}
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));
