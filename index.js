require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();

app.use(express.json());
app.use(express.static("dist"));
app.use(cors());

morgan.token('req-content', req => req.body ? JSON.stringify(req.body) : " ");
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-content"));


app.get("/info", (req, resp) => {
    resp.send(`<h1 style='
    background-color:black;
    color:white;
    text-align:center;
    padding:1em'>
    This is the phonebook API</h1>
    <p>There are actually, ${persons.length} persons in the phonebook.</p>
    <footer style='
    width:100%;
    text-align:center;
    background-color:gray;
    color:white'>${new Date()}</footer>`);
});

app.get("/api/persons", (req, resp) => {
    Person.find({}).then(result => {
        resp.json(result)
    });
})

app.get("/api/persons/:id", (req, resp) => {
    Person.findById(req.params.id).then(person => {
        resp.json(person);
    }).
    catch(error => resp.status(404).end());
});

app.delete("/api/persons/:id", (req, resp) => {
    const id = Number(req.params.id);
    persons = persons.filter(prsn => prsn.id !== id);
    resp.status(204).end();
});

app.post("/api/persons", (req, resp) => {
    const data = req.body;
    if (!data.name || !data.number) {
        return resp.status(400).json({
            error: 'content missing'
        })
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

const unknownEndpoint = (req, resp) => {
    resp.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint)

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));
