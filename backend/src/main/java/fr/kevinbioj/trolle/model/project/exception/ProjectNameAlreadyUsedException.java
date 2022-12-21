package fr.kevinbioj.trolle.model.project.exception;

import fr.kevinbioj.trolle.model.AbstractDomainException;

public class ProjectNameAlreadyUsedException extends AbstractDomainException {

    public ProjectNameAlreadyUsedException(String name) {
        super("PROJECT_NAME_ALREADY_USED", String.format("Project name \"%s\" is already used.", name));
    }
}
