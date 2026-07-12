package com.pranjal.AIResumeAnalyzer.controller;

import com.pranjal.AIResumeAnalyzer.entity.User;
import com.pranjal.AIResumeAnalyzer.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    // Lightweight endpoint used by the frontend to verify Basic Auth
    // credentials on login. Deliberately does NOT touch any other
    // service (AI service, resume service, etc.) so login can never
    // fail because of an unrelated dependency being down.
    @GetMapping("/me")
    public ResponseEntity<?> me() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok().body(
                new Object() {
                    public final String username = user.getUsername();
                    public final String email = user.getEmail();
                }
        );
    }
}

