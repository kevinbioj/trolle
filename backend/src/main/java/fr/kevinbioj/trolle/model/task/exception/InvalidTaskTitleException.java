package fr.kevinbioj.trolle.model.task.exception;

import fr.kevinbioj.trolle.model.AbstractDomainException;

public class InvalidTaskTitleException extends AbstractDomainException {

    public InvalidTaskTitleException(String name) {
        super("INVALID_TASK_TITLE", String.format("Task title \"%s\" does not match the expected format.", name));
    }
}
