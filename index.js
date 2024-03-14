const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
const morgan = require("morgan");

const PORT = process.env.PORT || 3490;

persons = [
  { id: 1, name: "Liam", number: "555-1234" },
  { id: 2, name: "Emma", number: "555-5678" },
  { id: 3, name: "Noah", number: "555-9012" },
  { id: 4, name: "Olivia", number: "555-3456" },
  { id: 5, name: "William", number: "555-7890" },
  { id: 6, name: "Ava", number: "555-2345" },
  { id: 7, name: "James", number: "555-6789" }
]

// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
// }
// app.use(requestLogger)
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
    resp.json(persons);
})

app.get("/api/persons/:id", (req, resp) => {
    const id = Number(req.params.id);
    const person = persons.filter(prsn => prsn.id === id);
    if (person.length > 0){
        resp.json(person);
    } else {
        resp.status(404).end();
    }
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
    if (persons.some(prsn => prsn.name === data.name)){
        return resp.status(400).json({
            error: 'this name alaready exists'
        })
    }
    if (persons.some(prsn => prsn.number === data.number)){
        return resp.status(400).json({
            error: 'this number alaready exists'
        })
    }
    const newPerson = {
        id : Math.floor(Math.random(0,100000000000)*100000000000),
        name : data.name,
        number: data.number
    }
    persons.push(newPerson);
    resp.json(newPerson);
})


const unknownEndpoint = (req, resp) => {
    resp.status(404).send({ error: 'unknown endpoint' });
}

app.use(unknownEndpoint)

app.listen(PORT, () => console.log(`Server runing on port ${PORT}`));
