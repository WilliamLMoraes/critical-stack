package com.critical_stack.mapper.common;

import com.critical_stack.dto.common.PaginatedResponse;
import lombok.experimental.UtilityClass;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.function.Function;

@UtilityClass
public class PaginatedMapper {

    public static <T, R> PaginatedResponse<R> toPaginatedResponse(Page<T> page, Function<T, R> mapper) {
        List<R> content = page.getContent().stream().map(mapper).toList();

        return PaginatedResponse.<R>builder()
                .content(content)
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .first(page.isFirst())
                .last(page.isLast())
                .build();
    }
}
