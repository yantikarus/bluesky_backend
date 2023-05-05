const express = require('express')
const app = express()
const morgan = require('morgan')
app.use(express.json())
app.set('json spaces', 2)

let quotes = [
    {content : "You have power over your mind – not outside events. Realize this, and you will find strength.” .",
    author:"Marcus Aurelius",
    id: 1
},
    {
    content : "Wealth consists not in having great possessions, but in having few wants.",
    author:"Seneca",
    id: 2
}

]
morgan('tiny')
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
  }
app.use(requestLogger)
app.get('/', (req, res)=>{
    res.send("Welcome to Daily Stoic")
})

app.get('/api/quotes', (req, res)=>{
    //send all the quotes
    res.json(quotes)
})

app.get('/api/quotes/:id', (req, res)=>{
    //get the id
    const id = Number(req.params.id)
    //find the quote with the id
    const quote = quotes.find(x => x.id ===id )
    //if there is quote, send the quote, if not found send status code 404 and the msg
    if(quote){
        res.json(quote)
    }else{
        res.status(404).json({error: "no quotes found"})
    }
    
})
app.delete('/api/quotes/:id', (req, res) =>{
    // get the id and store it
    const id = Number(req.params.id)
    quotes = quotes.filter(q => q.id !==id)
    res.status(204).end()
})
const generateId = () => {
    const maxId = quotes.length > 0
      ? Math.max(...quotes.map(n => n.id))
      : 0
    return maxId + 1
  }
app.post('/api/quotes', (req, res)=>{
    //rename the body to make it easier
    const body  = req.body
    //if no content 
    if(!body.content || !body.author){
        return res.status(400).json({error: 'content or author is missing'})
    }
    //parse the body and assign individual property
    const newQuotes = {
        content: body.content,
        author: body.author,
        id: generateId(),
    }
    // add to the quote collection or database
    quotes = quotes.concat(newQuotes)
    res.json(quotes)
})



const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

const PORT = 3005
app.listen(PORT, ()=>{
    console.log('server is listening to ', PORT)
})