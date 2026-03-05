import Task from '../models/Task.js';
import mongoose from 'mongoose';

// @desc    Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    // Standardize userId extraction
    const userId = req.user._id || req.user;

    const task = await Task.create({
      title,
      description,
      userId: userId
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task', error: error.message });
  }
};

// @desc    Get all tasks for the logged-in user
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id || req.user;
    const tasks = await Task.find({ userId: userId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// @desc    Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user;

    // 1. Validate if the ID is a valid MongoDB ObjectId to avoid casting errors
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: 'Invalid Task ID format' });
    }

    // 2. Use findOneAndDelete - it's more atomic and reliable for tests
    // We search by ID AND the userId to ensure ownership
    const task = await Task.findOneAndDelete({ 
      _id: id, 
      userId: userId 
    });

    if (!task) {
      // If null, either the task doesn't exist or it belongs to someone else
      return res.status(404).json({ message: 'Task not found' });
    }

    // 3. Explicitly send 200 for the test expectation
    res.status(200).json({ message: 'Task removed' });
  } catch (error) {
    console.error("DELETE ERROR:", error.message);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};