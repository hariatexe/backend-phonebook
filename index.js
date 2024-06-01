require('dotenv').config(); 
const Person = require('./models/person'); 

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    }, 
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const express = require('express');
const morgan = require('morgan'); 
const app = express(); 

// function logger(request,response,next){
//     console.log('Method: ', request.method); 
//     console.log('Path: ', request.path); 
//     console.log('Body:  ', request.body)
//     console.log('---')
//     next()
// }

// let app = "hola0"; 

app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) } )
//morgan('tiny')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// app.use((req,res,next)=>{
//     console.log(req.body); 
//     next(); 
// })

app.use(express.static("dist")); 

//cors 
const cors = require('cors')

app.use(cors())


//functions
// const personsCount = ()=>{
//     let count = 0;
//     Person.find({}).then(elt => {
//     })
//     return count; 
// }

// app.get('/',(request,response)=>{
//     response.send("<h1>Welcome</h1>"); 
// })
app.get('/info', (request,response)=>{
    Person.find({}).then(elt => {
       let persons = elt.length; 
       let time = new Date(); 
        response.send(`<p>Phonebook has info for ${persons} people</p><p>${time}</p>`); 
    }); 
    
})
app.get('/api/persons',(request,response)=>{
    Person.find({}).then(obj => {
        response.json(obj); 
    })
    // response.json(persons); 
})

app.get('/api/persons/:id',(request,response,next) => {
    let id = Number(request.params.id); 
    // const person = persons.find(elt => elt.id == id);

    // if(person){
    //     response.json(person); 
    // }else{
    //     response.statusMessage = "Person not found";  
    //     response.status(404).end(); 
    // }

    Person.findById(request.params.id).then(person =>{
        response.json(person); 
    }).catch(err=> next(err)); 
})

app.delete('/api/persons/:id',(request,response,next) =>{
    let id = request.params.id; 
    // const person = persons.filter(elt => elt.id !== id);
    Person.findByIdAndDelete(id).then(res=>{
        response.status(204).end(); 
    }).catch(err => next(err)); 

    // response.statusMessage = "Successfully removed person";
    // response.status(204).end();  

})

app.use(express.json()); 

const generateId = ()=>{
    return Math.random() * 200; 
}

app.post('/api/persons',(request,response,next)=>{
    let body = request.body;
    // let arr = persons.map(elt => elt.name);

    if(!body.name || !body.number){
        return response.status(400).json({
            error: "name or number missing"
        })
    }

    // if(arr.includes(body.name)){
    //     return response.status(400).json({
    //         error: "name must be unique"
    //     })
    // }

    // const person = {
    //     id: generateId(), 
    //     name: body.name, 
    //     number: body.number
    // }

    const person = new Person({
        id: generateId(), 
        name: body.name, 
        number: body.number
    })
    // ? body.number : "No number entered"

    // persons = persons.concat(person); 

    person.save().then(savedPerson => {
        response.json(savedPerson)
        response.statusMessage = 'Successfully created person'; 
    })
    .catch(err => {
        next(err);
    }); 
    // response.status(200).json(person); 
})

app.put('/api/persons/:id',(request,response,next)=>{
    const id = request.params.id; 
    const {name, number} = request.body; 
    if(!name){
        return response.status(400).json({
            error: 'content missing'
        })
    }

    // const person = {
    //     name: body.name, 
    //     number: body.number
    // }

    Person.findByIdAndUpdate(id, {name,number}, {new : true, runValidators: true, context: 'query'})
    .then(updatedNote => {
        response.json(updatedNote)
    })
    .catch(err => next(err));
})

const unknownEndpoint = (request,response) =>{
    response.status(404).send({ error : 'unknown endpoint'}); 
}

app.use(unknownEndpoint); 


const errorHandler = (error,request,response,next)=>{
    console.log(error); 
    console.log(error.message); 
    if(error.name === "CastError"){
        return response.status(400).send({ error: 'malformatted id'}); 
    }
    else if(error.name === "ValidationError"){
        return response.status(400).json({ error: error.message }); 
    }
    next(error);    
}

 app.use(errorHandler); 


const PORT = process.env.PORT || 3001; 
app.listen(PORT,()=>{
    console.log('Server running on port '+PORT); 
}); 
