package com.pranjal.AIResumeAnalyzer.controller;

import com.pranjal.AIResumeAnalyzer.entity.User;
import com.pranjal.AIResumeAnalyzer.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@Slf4j
public class PublicController {

    @Autowired
    private UserService userService;
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck(){
        return ResponseEntity.ok().build();
    }

    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody User user){
        log.info("Attempting to create user: {}", user.getUsername());
        userService.saveNewUser(user);
        log.info("User created successfully: {}", user.getUsername());
        return ResponseEntity.ok().build();
    }

}
