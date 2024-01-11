const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('data', function(req, res) {
    return JSON.stringify(req.body)
})

app.use(express.json())

app.use(morgan('tiny', {
    skip: (req, res) => req.method === "POST"
}))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data', {
    skip: (req, res) => req.method !== "POST"
}))

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    const returnedHtml = `<p>Phonebook has info for ${persons.length} ${persons.length > 1 ? 'people' : 'person'} <br/> ${new Date()}</p>`
    
    response.send(returnedHtml)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    // if (!request.body) { IS IT ENOUGH ?
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'missing name or number'
        })
    }

    const personCheck = persons.find(p => p.name.toLowerCase() === body.name.toLowerCase())

    if(personCheck) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: Math.floor(Math.random() * 10000),
        ...body
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)