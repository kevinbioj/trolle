package fr.kevinbioj.trolle.model.user.exception;

import fr.kevinbioj.trolle.model.AbstractDomainException;

public class InvalidUsernameException extends AbstractDomainException {

    public InvalidUsernameException(String username) {
        super("INVALID_USERNAME", String.format("Username \"%s\" does not match the expected format.", username));
    }
}
