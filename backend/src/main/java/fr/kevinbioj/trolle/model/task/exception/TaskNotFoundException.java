package fr.kevinbioj.trolle.model.task.exception;

import fr.kevinbioj.trolle.model.AbstractDomainException;

import java.util.UUID;

public class TaskNotFoundException extends AbstractDomainException {

    public TaskNotFoundException(UUID id) {
        super("TASK_NOT_FOUND", String.format("No task was found with id: %s.", id));
    }
}
