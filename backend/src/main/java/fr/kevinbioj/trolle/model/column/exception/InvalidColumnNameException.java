package fr.kevinbioj.trolle.model.column.exception;

import fr.kevinbioj.trolle.model.AbstractDomainException;

public class InvalidColumnNameException extends AbstractDomainException {

    public InvalidColumnNameException(String name) {
        super("INVALID_COLUMN_NAME", String.format("Column name \"%s\" does not match the expected format.", name));
    }
}
