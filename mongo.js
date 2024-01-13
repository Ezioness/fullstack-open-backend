const mongoose = require('mongoose')

const argsLength = process.argv.length
if(argsLength < 3) {
    console.log('give password as argument')
    process.exit(1)
}


const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.jai3lhh.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery')
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if(argsLength === 3) {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(person => console.log(person.name, person.number))
        mongoose.connection.close()
    })
} else {
    const person = new Person({
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log(`added ${result.name} to phonebook`)
        mongoose.connection.close()
    })
}