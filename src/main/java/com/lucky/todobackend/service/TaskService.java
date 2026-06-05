package com.lucky.todobackend.service;

import com.lucky.todobackend.entity.Task;
import com.lucky.todobackend.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class TaskService {

    private final TaskRepository repository;

    public TaskService(TaskRepository repository) {
        this.repository = repository;
    }

    // ✅ FIXED: create task with fallback userId
    public Task createTask(Task task) {
        if (task.getUserId() == null) {
            task.setUserId("demo");
        }
        return repository.save(task);
    }

    // ❌ REMOVE global fetch (important)
    public List<Task> getAllTasks() {
        return repository.findAll();
    }

    // ✅ FIXED: user-specific fetch
    public List<Task> getTasksByUser(String userId) {
        return repository.findByUserId(userId);
    }

    public void deleteTask(Long id) {
        repository.deleteById(id);
    }

    public Task updateTask(Long id, Task updatedTask) {

        Task existingTask = repository.findById(id).orElseThrow();

        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setCompleted(updatedTask.isCompleted());
        existingTask.setPriority(updatedTask.getPriority());
        existingTask.setCategory(updatedTask.getCategory());
        existingTask.setDueDate(updatedTask.getDueDate());

        // 🔥 IMPORTANT FIX
        if (updatedTask.getUserId() != null) {
            existingTask.setUserId(updatedTask.getUserId());
        }

        return repository.save(existingTask);
    }
}