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

    public List<Task> getAllTasks() {
        return repository.findAll();
    }
    public Task createTask(Task task) {
        return repository.save(task);
    }
    public void deleteTask(Long id) {
        repository.deleteById(id);
    }
    public Task updateTask(Long id, Task updatedTask) {

        Task existingTask =
                repository.findById(id)
                        .orElseThrow();

        existingTask.setTitle(updatedTask.getTitle());

        existingTask.setCompleted(
                updatedTask.isCompleted()
        );

        existingTask.setPriority(
                updatedTask.getPriority()
        );

        existingTask.setCategory(
                updatedTask.getCategory()
        );

        existingTask.setDueDate(
                updatedTask.getDueDate()
        );

        return repository.save(existingTask);
    }
}