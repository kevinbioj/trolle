package fr.kevinbioj.trolle.view;

import fr.kevinbioj.trolle.model.user.UserEntity;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

public record UserView(String username,
                       String displayName,
                       OffsetDateTime createdAt) {

    public static UserView from(UserEntity user) {
        return new UserView(
                user.getUsername(),
                user.getDisplayName(),
                user.getCreatedAt().atOffset(ZoneOffset.UTC));
    }
}
