package com.critical_stack.service.user;

import com.critical_stack.domain.UserDomain;
import com.critical_stack.dto.user.request.AuthUserRequest;
import com.critical_stack.dto.user.request.RegisterUserRequest;
import com.critical_stack.dto.user.response.AuthUserResponse;
import com.critical_stack.dto.user.response.UserResponse;
import com.critical_stack.exception.InvalidCredentialsException;
import com.critical_stack.exception.UserNotFoundException;
import com.critical_stack.mapper.user.UserMapper;
import com.critical_stack.repository.UserRepository;
import com.critical_stack.validator.AuthUserValidator;
import com.critical_stack.validator.RegisterUserValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import static com.critical_stack.mapper.user.AuthUserMapper.toResponse;
import static com.critical_stack.mapper.user.CreateUserMapper.*;

@Service
@RequiredArgsConstructor
public class UserService {

    private static final Long TOKEN_EXPIRATION_SECONDS = 15L * 60L;
    private final UserRepository userRepository;
    private final RegisterUserValidator registerUserValidator;
    private final PasswordEncoder passwordEncoder;
    private final AuthUserValidator authUserValidator;
    private final JWTUserService authenticatedUserService;


    public void register(RegisterUserRequest request) {

        registerUserValidator.validate(request);

        UserDomain usuario = toEntity(request, passwordEncoder);

        userRepository.save(usuario);
    }

    public AuthUserResponse auth(AuthUserRequest request) {

        UserDomain user = findUserByEmail(request.getEmail());

        authUserValidator.authenticate(request.getPassword(), user.getPassword());

        String token = authenticatedUserService.generateToken(user, TOKEN_EXPIRATION_SECONDS);

        return toResponse(token, TOKEN_EXPIRATION_SECONDS);
    }

    public UserResponse getUser() {

        UserDomain user = authenticatedUserService.getLoggedUserDomain();

        return UserMapper.toResponse(user);
    }

    public AuthUserResponse refresh() {

        UserDomain user = authenticatedUserService.getLoggedUserDomain();

        String token = authenticatedUserService.generateToken(user, TOKEN_EXPIRATION_SECONDS);

        return toResponse(token, TOKEN_EXPIRATION_SECONDS);
    }

    public UserDomain getUserEntity() {
        return authenticatedUserService.getLoggedUserDomain();
    }

    public UserDomain findUserByEmail(String email) {
        return userRepository.findByEmailAndEnabled(email, true)
                .orElseThrow(InvalidCredentialsException::new);
    }

    public UserDomain findUserById(Long id) {
        return userRepository.findByIdAndEnabled(id, true)
                .orElseThrow(UserNotFoundException::new);
    }
}
