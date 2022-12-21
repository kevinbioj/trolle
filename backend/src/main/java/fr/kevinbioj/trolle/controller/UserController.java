package fr.kevinbioj.trolle.controller;

import fr.kevinbioj.trolle.model.user.UserEntity;
import fr.kevinbioj.trolle.model.user.UserService;
import fr.kevinbioj.trolle.view.UserView;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@AllArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {

    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    // --- ANONYMOUS ENDPOINTS

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserView register(@RequestBody @Valid RegistrationDto data) {
        var encodedPassword = passwordEncoder.encode(data.password());
        var user = userService.register(data.username(), encodedPassword, data.displayName());
        return UserView.from(user);
    }

    // --- AUTHENTICATED ENDPOINTS

    @GetMapping("/{username}")
    public UserView get(@PathVariable String username) {
        var user = userService.get(username);
        return UserView.from(user);
    }

    @GetMapping("/@me")
    public UserView getAuthenticated(Authentication auth) {
        var user = userService.get(auth.getName());
        return UserView.from(user);
    }

    @PatchMapping("/@me")
    public UserView updateAuthenticated(Authentication auth, @RequestBody @Valid UpdateUserDto data) {
        var user = userService.get(auth.getName());
        var updated = userService.update(user, data.displayName());
        return UserView.from(updated);
    }

    @PutMapping("/@me/password")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void changeAuthenticatedPassword(Authentication auth, @RequestBody @Valid ChangePasswordDto data) {
        var user = userService.get(auth.getName());
        if (!passwordEncoder.matches(data.current(), user.getPassword()))
            throw new AccessDeniedException("The current password is incorrect, please try again.");
        var encodedPassword = passwordEncoder.encode(data.password());
        userService.changePassword(user, encodedPassword);
    }

    // --- DATA TRANSFER OBJECTS

    private record RegistrationDto(@NotNull @Pattern(regexp = UserEntity.USERNAME_PATTERN) String username,
                                   @NotNull String password,
                                   @NotNull @Pattern(regexp = UserEntity.DISPLAY_NAME_PATTERN) String displayName) {
    }

    private record UpdateUserDto(@Pattern(regexp = UserEntity.DISPLAY_NAME_PATTERN) String displayName) {
    }

    private record ChangePasswordDto(@NotNull String current,
                                     @NotNull String password) {
    }
}
