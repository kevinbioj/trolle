package fr.kevinbioj.trolle.model.column.exception;

import fr.kevinbioj.trolle.model.AbstractDomainException;
import fr.kevinbioj.trolle.model.project.ProjectEntity;

public class ColumnNotFoundException extends AbstractDomainException {

    public ColumnNotFoundException(ProjectEntity project, Integer id) {
        super("COLUMN_NOT_FOUND", String.format("Project \"%s\" has no column with id: %d.", project.getName(), id));
    }
}
