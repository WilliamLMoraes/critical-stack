package com.critical_stack.mapper.user;

import com.critical_stack.domain.UserDomain;
import com.critical_stack.dto.user.response.UserResponse;
import lombok.experimental.UtilityClass;

@UtilityClass
public class UserMapper {

    public static UserResponse toResponse(UserDomain response) {

        return UserResponse.builder()
                .id(response.getId())
                .username(response.getUsername())
                .email(response.getEmail())
                .enabled(response.getEnabled())
                .build();
    }
}
