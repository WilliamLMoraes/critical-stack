package com.critical_stack.validator;

import com.critical_stack.dto.user.request.RegisterUserRequest;
import com.critical_stack.exception.UserEmailAlreadyExistsException;
import com.critical_stack.exception.UsernameAlreadyExistsException;
import com.critical_stack.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class RegisterUserValidator {

    private final UserRepository userRepository;

    public void validate(RegisterUserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserEmailAlreadyExistsException();
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UsernameAlreadyExistsException();
        }
    }
}

