const {
    Router
} = require("express");
const controller = require("../controllers/todo");
const guard = require("../middleware/guard")

const router = Router();

router.get("/", guard.authenticateToken, controller.getTodos);

router.post("/", guard.authenticateToken, controller.postTodo);

router.delete("/:id", guard.authenticateToken, controller.deleteTodo);

router.patch("/:id", guard.authenticateToken, controller.checkTodo);


module.exports = router;