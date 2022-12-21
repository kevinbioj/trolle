package fr.kevinbioj.trolle.model.project.exception;

import fr.kevinbioj.trolle.model.AbstractDomainException;

public class InvalidProjectNameException extends AbstractDomainException {

    public InvalidProjectNameException(String name) {
        super("INVALID_PROJECT_NAME", String.format("Project name \"%s\" does not match the expected format.", name));
    }
}
