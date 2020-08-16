const express = require('express');
const app = express();
const { Sequelize , DataTypes } = require('sequelize');
const pgtools = require('pgtools');

const port = 8000

app.get('/', (req, res) => {
      res.send('Todolist API')
})

const sequelize = new Sequelize('postgres://appseed:appseed@localhost:5432/Todo', {
    define: { timestamps: false },
    logging: false
}) // Example for postgres

const config = {
    user: "appseed",
    host: "localhost",
    password: "appseed",
    port: 5432
}

try {
      sequelize.authenticate();
      console.log('Connection has been established successfully.');
    
} catch (error) {
      console.error('Unable to connect to the database:', error);
    
}

//pgtools.createdb(config, "Todo", function(err, res) {
    //if (err) {
            //console.error(err);
            //process.exit(-1);
          
    //}
      //console.log(res);
//});

const Todo = sequelize.define('todo', {
    todoName: { type: DataTypes.STRING, allowNull: false, unique: true},
    completed: DataTypes.BOOLEAN
}, {
    // Options
});


async function insertTodo(todoName) {
    await sequelize.sync().then(() => {
        Todo.create({
            todoName: todoName,
            completed: false
        }).catch((e) => {
            console.log(e);
        });
    }).catch((e) => {
        console.log(e);
    });
}

async function deleteTodo(todoName) {
    await Todo.destroy({
        where: {
            todoName: todoName
        }
    }).catch((e) => {
        console.log(e)
    });
}

async function getAllTodo() {

    try {
        const raw = await Todo.findAll({})
        console.log(raw)
    } catch (e) {
        console.log(e);
    }
}

async function parseData(raw) {
    data = []
    for (item in raw) {
       data.push({
           "todoName": item['dataValues']['todoName'],
           "completed": item['dataValues']['completed']
       }) 
    }
    return data
}

insertTodo('test1');
insertTodo('test2');

app.listen(port, () => {console.log(`Todolist app listening at http://localhost:${port}`)})
