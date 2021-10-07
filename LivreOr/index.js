const express = require('express')
const app = express()
const port = 80

const users = [
  {
    username: 'alice',
    name: 'Alice',
  },
  {
    username: 'bob',
    name: 'Bob',
  },
]

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/:username', (req, res) => {
  const user = users.find(
    user => user.username === req.params.username
  )
  if (!user) {
    return res.sendStatus(404)
  }

  return res.send(`${user.name}, Hello World!`)
});

app.listen(port, () => console.log('Server ON!'))
