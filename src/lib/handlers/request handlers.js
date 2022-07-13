const Express = require("express");
const { getDBHandler } = require("../db");

const RequestHandler = Express.Router();

RequestHandler.get("/to-dos", async(request, response) => {
    try {
        const dbHandler = await getDBHandler();
        const todos = await dbHandler.all("SELECT * FROM todos")
        await dbHandler.close();

        if(!todos || !todos.length){
            return response.status(404).send({message: "To Dos Not Found"}).end();
        }
        response.send({ todos });

    } catch (error) {
        response.status(500).send({
            error: "Something went wrong when trying to get the to dos list", 
            errorInfo: error.message,
        })
    }
});

RequestHandler.post("/to-dos", async(request, response) => {
    try {
        const { title, description, isDone: is_done } = request.body;

        const dbHandler = await getDBHandler();

        const newTodo = await dbHandler.run(
            `INSERT INTO todos (title, description, is_done, creation_date, edit_date) 
            VALUES (
                '${title}',
                '${description}',
                ${is_done},
                DATE('now', 'localtime'),
                ''
            )`
        );
        
        await dbHandler.close();
    
        response.send({
            todoAdded: {
            title,
            description,
            isDone: is_done,
            },
        });
    } catch (error) {
        response.status(500).send({
            error: "Something went wrong when trying to create a new to do", 
            errorInfo: error.message,
        })
    }
});


RequestHandler.patch("/to-dos/:id?", async(request, response) => {
    try {
        const todoId = request.params.id;

        const dbHandler = await getDBHandler();

        if (!todoId) {
            response.status(400).send({ error: `A to do id was expected, got ${todoId}` });
        }
        
        

        const { title, description, isDone: is_done } = request.body;
        
        const todoToUpdate = await dbHandler.get(
            `SELECT * FROM todos WHERE id = ?`,
            todoId
        )

        if(todoToUpdate === undefined){
            dbHandler.close();
            return response.status(404).send({message: "To Do Not Found"});
        }

        
        const updatedTodo = await dbHandler.run(
            `UPDATE todos
                SET title = ?,
                description = ?,
                is_done = ?,
                edit_date = DATE('now', 'localtime')
                WHERE id = ?`,
            title || todoToUpdate.title,
            description || todoToUpdate.description,
            is_done !== undefined ? is_done : todoToUpdate.is_done,
            todoId
        );
    
        await dbHandler.close();
    
        response.send({
        updatedTodo: { title, description, isDone: is_done },
        });


    } catch (error) {
        response.status(500).send({
            error: "Something went wrong when trying to update a new to do", 
            errorInfo: error.message,
        })
    }
});

RequestHandler.delete("/to-dos/:id", async(request, response) => {
    try {
        const todoId = request.params.id;
        const dbHandler = await getDBHandler();
        const deletedTodo = await dbHandler.run(
        "DELETE FROM todos WHERE id = ?",
        todoId
        );
    
        dbHandler.close();
    
        response.send(deletedTodo);

    } catch (error) {
        response.status(500).send({
            error: "Something went wrong when trying to delete a to do", 
            errorInfo: error.message,
        })
    }
}); 



module.exports = RequestHandler;