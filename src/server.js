import express from 'express';

const app  = express()
app.use(express.json())
const port = 8080

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})