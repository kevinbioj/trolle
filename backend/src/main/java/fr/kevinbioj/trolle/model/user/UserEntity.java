package fr.kevinbioj.trolle.model.user;

import fr.kevinbioj.trolle.model.user.exception.InvalidDisplayNameException;
import fr.kevinbioj.trolle.model.user.exception.InvalidUsernameException;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.regex.Pattern;

@Data @EqualsAndHashCode(of = "id") @ToString(of = "id")
@Entity @Table(name = "user")
public class UserEntity {

    public static final String USERNAME_PATTERN = "^[A-Za-z][A-Za-z0-9_]{0,19}$";
    public static final String DISPLAY_NAME_PATTERN = "^.{1,40}$";

    // ---

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "VARCHAR(20)", nullable = false, updatable = false, unique = true)
    private String username;

    @Column(columnDefinition = "BINARY(60)", nullable = false)
    private String password;

    @Column(columnDefinition = "VARCHAR(40)", nullable = false)
    private String displayName;

    @Column(columnDefinition = "TIMESTAMP", nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    // ---

    public void setUsername(String username) {
        if (!Pattern.matches(USERNAME_PATTERN, username))
            throw new InvalidUsernameException(username);
        this.username = username;
    }

    public void setDisplayName(String displayName) {
        if (!Pattern.matches(DISPLAY_NAME_PATTERN, displayName))
            throw new InvalidDisplayNameException(displayName);
        this.displayName = displayName;
    }

    // ---

    /**
     * Crée une entité utilisateur avec les informations initiales fournies.
     *
     * @param username    Pseudonyme de l'utilisateur.
     * @param password    Mot de passe de l'utilisateur.
     * @param displayName Nom d'affichage de l'utilisateur.
     */
    public static UserEntity create(String username, String password, String displayName) {
        var user = new UserEntity();
        user.setUsername(username);
        user.setPassword(password);
        user.setDisplayName(displayName);
        return user;
    }
}
