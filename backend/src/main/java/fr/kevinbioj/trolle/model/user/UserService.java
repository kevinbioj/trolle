package fr.kevinbioj.trolle.model.user;

import fr.kevinbioj.trolle.model.user.exception.UserNotFoundException;
import fr.kevinbioj.trolle.model.user.exception.UsernameAlreadyUsedException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@AllArgsConstructor
@Service
public class UserService {

    private final UserRepository userRepository;

    // ---

    /**
     * Modifie le mot de passe de l'utilisateur cible.
     *
     * @param user     Utilisateur à modifier.
     * @param password Nouveau mot de passe.
     */
    public void changePassword(UserEntity user, String password) {
        user.setPassword(password);
        userRepository.save(user);
    }

    /**
     * Recherche un utilisateur à l'aide de son pseudonyme.
     * La casse est ignorée lors de la recherche.
     *
     * @param username Pseudonyme de l'utilisateur.
     */
    public Optional<UserEntity> findByUsername(String username) {
        return userRepository.findByUsernameIgnoreCase(username);
    }

    /**
     * Récupère un utilisateur à l'aide de son pseudonyme.
     * La casse est ignorée lors de la recherche.
     *
     * @param username Pseudonyme de l'utilisateur.
     */
    public UserEntity get(String username) {
        return userRepository
                .findByUsernameIgnoreCase(username)
                .orElseThrow(() -> new UserNotFoundException(username));
    }

    /**
     * Enregistre un nouvel utilisateur dans l'application.
     *
     * @param username    Pseudonyme de l'utilisateur.
     * @param password    Mot de passe de l'utilisateur.
     * @param displayName Nom d'affichage de l'utilisateur.
     */
    public UserEntity register(String username, String password, String displayName) {
        if (userRepository.existsByUsernameIgnoreCase(username))
            throw new UsernameAlreadyUsedException(username);
        var user = UserEntity.create(username, password, displayName);
        return userRepository.save(user);
    }

    /**
     * Met à jour l'utilisateur cible avec les nouvelles informations.
     *
     * @param user        Utilisateur à mettre à jour.
     * @param displayName Nouveau nom d'affichage de l'utilisateur (facultatif).
     */
    public UserEntity update(UserEntity user, String displayName) {
        if (displayName != null) {
            user.setDisplayName(displayName);
        }
        return userRepository.save(user);
    }
}
