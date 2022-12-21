package fr.kevinbioj.trolle.model.user.exception;

import fr.kevinbioj.trolle.model.AbstractDomainException;

public class UserNotFoundException extends AbstractDomainException {

    public UserNotFoundException(String username) {
        super("USER_NOT_FOUND", String.format("No user was found with username \"%s\".", username));
    }
}
