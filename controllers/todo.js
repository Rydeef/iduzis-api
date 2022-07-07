const Todo = require("../models/Todo");
const {
    v4: uuidv4
} = require('uuid');
const jwt = require("jsonwebtoken");

module.exports.getTodos = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const {
            date
        } = req.query

        const token = authHeader.split(' ')[1];
        const user = jwt.decode(token);
        const todos = await Todo.find({
            owner: user.username,
            date: new Date(date).toISOString()
        });

        if (!todos.length) {
            return res.status(209).json({
                message: "No todos"
            });
        }

        return res.status(200).json({
            todos
        });
    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

module.exports.postTodo = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const {
            title,
        } = req.body

        const {
            date
        } = req.query

        const token = authHeader.split(' ')[1];
        const user = jwt.decode(token);

        const todoItem = {
            owner: user.username,
            id: uuidv4(),
            date: new Date(date).toISOString(),
            title,
            checked: false
        };

        const todo = new Todo(todoItem);

        await todo.save();

        const todos = await Todo.find({
            owner: user.username,
            date: new Date(date).toISOString()
        })

        if (!todos.length) {
            return res.status(209).json({
                message: "No todos"
            });
        }

        return res.status(200).json({
            todos
        });
    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

module.exports.deleteTodo = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const {
            id
        } = req.params
        const {
            date
        } = req.query

        const token = authHeader.split(' ')[1];
        const user = jwt.decode(token);

        const candidate = await Todo.findOne({
            id
        })

        if (!candidate) {
            return res.status(209).json({
                message: "Todo does not exists"
            });
        }

        await Todo.findOneAndRemove({
            id
        })

        const todos = await Todo.find({
            owner: user.username,
            date: new Date(date).toISOString()
        });

        if (!todos.length) {
            return res.status(209).json({
                message: "No todos"
            });
        }

        return res.status(200).json({
            todos
        });
    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}

module.exports.checkTodo = async (req, res) => {
    try {
        const authHeader = req.headers["authorization"];
        const {
            id
        } = req.params
        const {
            date
        } = req.query
        const token = authHeader.split(' ')[1];
        const user = jwt.decode(token);

        const candidate = await Todo.findOne({
            id
        })

        if (!candidate) {
            return res.status(209).json({
                message: "Todo does not exists"
            });
        }

        await Todo.findOneAndUpdate({
            id
        }, {
            checked: !candidate.checked
        });

        const todos = await Todo.find({
            owner: user.username,
            date: new Date(date).toISOString()
        });

        if (!todos.length) {
            return res.status(209).json({
                message: "No todos"
            });
        }

        return res.status(200).json({
            todos
        });
    } catch (e) {
        return res.status(500).json({
            message: "Something went wrong"
        });
    }
}