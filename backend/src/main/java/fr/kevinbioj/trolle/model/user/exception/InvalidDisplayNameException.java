package fr.kevinbioj.trolle.model.user.exception;

import fr.kevinbioj.trolle.model.AbstractDomainException;

public class InvalidDisplayNameException extends AbstractDomainException {

    public InvalidDisplayNameException(String displayName) {
        super("INVALID_DISPLAY_NAME",
                String.format("Display name \"%s\" does not match the expected format.", displayName));
    }
}
