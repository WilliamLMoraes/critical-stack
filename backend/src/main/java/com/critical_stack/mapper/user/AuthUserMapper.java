package com.critical_stack.mapper.user;

import com.critical_stack.dto.user.response.AuthUserResponse;
import lombok.experimental.UtilityClass;

@UtilityClass
public class AuthUserMapper {

    public static AuthUserResponse toResponse(String token, Long tokenExpirationSeconds) {

        return AuthUserResponse.builder()
                .expiresIn(tokenExpirationSeconds)
                .token(token)
                .build();
    }
}
