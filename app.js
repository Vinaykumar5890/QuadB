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

app.post('/todoAdd', async (request, response) => {
  const {Id, Tasks} = request.body
  const postQuery = `
  INSERT INTO
    todos (Id,Tasks)
  VALUES
    (${Id}, '${Tasks}');`
  await database.run(postQuery)
  response.send('Tasks Successfully Added')
})

app.delete('/todo/:Id', async (request, response) => {
  const {Id} = request.params
  const deleteQuery = `
  DELETE FROM
    todos
  WHERE
    Id = ${Id} 
  `
  await database.run(deleteQuery)
  response.send('Tasks Deleted')
})
app.put('/todo/:Id', async (request, response) => {
  const {Id} = request.params
  const {Tasks} = request.body
  const updateDistrictQuery = `
  UPDATE
    todos
  SET
   Tasks = '${Tasks}'
  WHERE
    Id = ${Id};
  `

  const updateQuery = await database.run(updateDistrictQuery)
  response.send('Tasks Updates Succesfully')
})

module.exports = app
