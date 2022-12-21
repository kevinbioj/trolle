package fr.kevinbioj.trolle.model;

import lombok.Getter;

@Getter
public abstract class AbstractDomainException extends RuntimeException {

    private final String title;
    private final String details;

    public AbstractDomainException(String title, String details) {
        this.title = title;
        this.details = details;
    }
}
