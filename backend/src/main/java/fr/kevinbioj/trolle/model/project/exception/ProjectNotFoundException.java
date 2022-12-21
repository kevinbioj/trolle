package fr.kevinbioj.trolle.model.project.exception;

import fr.kevinbioj.trolle.model.AbstractDomainException;

import java.util.UUID;

public class ProjectNotFoundException extends AbstractDomainException {

    public ProjectNotFoundException(UUID id) {
        super("PROJECT_NOT_FOUND", String.format("No project was found with id: %s.", id));
    }
}
