const express = require("express");
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// CREATE TASK
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        const task = await Task.create({
            title,
            description,
            status,
            priority,
            dueDate,
            userId: req.userId
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create task"
        });
    }
});


// GET ALL USER TASKS
router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find({
            userId: req.userId
        }).sort({ createdAt: -1 });

        res.json(tasks);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
});


// UPDATE TASK
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, description, status, priority, dueDate } = req.body;

        const task = await Task.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.userId
            },
            {
                title,
                description,
                status,
                priority,
                dueDate
            },
            {
                new: true
            }
        );

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update task"
        });
    }
});


// DELETE TASK
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete task"
        });
    }
});


module.exports = router;