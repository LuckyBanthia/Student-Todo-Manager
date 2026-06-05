package com.lucky.todobackend.repository;
import java.util.List;

import com.lucky.todobackend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(String userId);
}