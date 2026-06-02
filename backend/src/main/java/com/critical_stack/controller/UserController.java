package com.critical_stack.controller;

import com.critical_stack.dto.user.request.AuthUserRequest;
import com.critical_stack.dto.user.request.RegisterUserRequest;
import com.critical_stack.dto.user.response.AuthUserResponse;
import com.critical_stack.dto.user.response.UserResponse;
import com.critical_stack.service.user.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.CREATED;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    @ResponseStatus(CREATED)
    public void register(@Valid @RequestBody RegisterUserRequest request) {
        userService.register(request);
    }

    @PostMapping("/auth")
    public AuthUserResponse auth(@Valid @RequestBody AuthUserRequest request) {
        return userService.auth(request);
    }

    @GetMapping("/logged-user")
    public UserResponse loggedUser() {
        return userService.getUser();
    }

    @PostMapping("/refresh")
    public AuthUserResponse refresh() {
        return userService.refresh();
    }
}
