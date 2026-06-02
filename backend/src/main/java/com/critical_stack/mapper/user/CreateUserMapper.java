package com.critical_stack.mapper.user;

import com.critical_stack.dto.user.request.RegisterUserRequest;
import com.critical_stack.domain.UserDomain;
import lombok.experimental.UtilityClass;
import org.springframework.security.crypto.password.PasswordEncoder;

@UtilityClass
public class CreateUserMapper {

    public static UserDomain toEntity(RegisterUserRequest request, PasswordEncoder passwordEncoder) {

        return UserDomain.builder()
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .build();
    }
}
