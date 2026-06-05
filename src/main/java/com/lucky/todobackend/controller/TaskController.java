package com.lucky.todobackend.controller;

import com.lucky.todobackend.entity.Task;
import com.lucky.todobackend.service.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService service;

    public TaskController(TaskService service) {
        this.service = service;
    }

    @GetMapping
    public List<Task> getTasks(@RequestParam String userId) {
        return service.getTasksByUser(userId);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {

        if (task.getUserId() == null) {
            task.setUserId("demo");
        }

        return service.createTask(task);
    }

    @PutMapping("/{id}")
    public Task updateTask(
            @PathVariable Long id,
            @RequestBody Task task) {

        return service.updateTask(id, task);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        service.deleteTask(id);
    }
}