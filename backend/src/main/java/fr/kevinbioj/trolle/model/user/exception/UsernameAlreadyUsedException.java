package fr.kevinbioj.trolle.model.user.exception;

import fr.kevinbioj.trolle.model.AbstractDomainException;

public class UsernameAlreadyUsedException extends AbstractDomainException {

    public UsernameAlreadyUsedException(String username) {
        super("USERNAME_ALREADY_USED", String.format("Username \"%s\" is already used by someone else.", username));
    }
}
