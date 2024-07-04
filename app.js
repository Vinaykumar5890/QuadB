const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
const databasePath = path.join(__dirname, 'todoList.db')

const app = express()

app.use(express.json())

let database = null

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    })

    app.listen(3000, () =>
      console.log('Server Running at http://localhost:3000/'),
    )
  } catch (error) {
    console.log(`DB Error: ${error.message}`)
    process.exit(1)
  }
}

initializeDbAndServer()

app.get('/todo', async (request, response) => {
  const getQuery = `
    SELECT
      *
    FROM
      todos;`
  const Array = await database.all(getQuery)
  response.send(Array)
})

app.post('/todoadd', async (request, response) => {
  const {id, tasks} = request.body
  const postQuery = `
  INSERT INTO
    todos (id,tasks)
  VALUES
    (${id}, '${tasks}');`
  await database.run(postQuery)
  response.send('Tasks Successfully Added')
})

app.delete('/todo/:id', async (request, response) => {
  const {id} = request.params
  const deleteQuery = `
  DELETE FROM
    todos
  WHERE
    id = ${id} 
  `
  await database.run(deleteQuery)
  response.send('Tasks Deleted')
})
app.put('/todo/:id', async (request, response) => {
  const {id} = request.params
  const {tasks} = request.body
  const updateDistrictQuery = `
  UPDATE
    todos
  SET
   tasks = '${tasks}'
  WHERE
    id = ${id};
  `

  const updateQuery = await database.run(updateDistrictQuery)
  response.send('Tasks Updates Succesfully')
})

module.exports = app
