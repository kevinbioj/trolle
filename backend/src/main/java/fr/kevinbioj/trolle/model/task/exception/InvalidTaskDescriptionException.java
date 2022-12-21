package fr.kevinbioj.trolle.model.task.exception;

import fr.kevinbioj.trolle.model.AbstractDomainException;

public class InvalidTaskDescriptionException extends AbstractDomainException {

    public InvalidTaskDescriptionException() {
        super("INVALID_TASK_DESCRIPTION", "The supplied task description does not match the expected format.");
    }
}
