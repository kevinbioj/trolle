package fr.kevinbioj.trolle.controller;

import fr.kevinbioj.trolle.model.AbstractDomainException;
import fr.kevinbioj.trolle.model.column.exception.InvalidColumnNameException;
import fr.kevinbioj.trolle.model.member.exception.MemberAlreadyExistsException;
import fr.kevinbioj.trolle.model.member.exception.MemberNotFoundException;
import fr.kevinbioj.trolle.model.project.exception.InvalidProjectNameException;
import fr.kevinbioj.trolle.model.project.exception.ProjectNameAlreadyUsedException;
import fr.kevinbioj.trolle.model.project.exception.ProjectNotFoundException;
import fr.kevinbioj.trolle.model.user.exception.InvalidDisplayNameException;
import fr.kevinbioj.trolle.model.user.exception.InvalidUsernameException;
import fr.kevinbioj.trolle.model.user.exception.UserNotFoundException;
import fr.kevinbioj.trolle.model.user.exception.UsernameAlreadyUsedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({
            InvalidColumnNameException.class,
            InvalidDisplayNameException.class,
            InvalidProjectNameException.class,
            InvalidUsernameException.class
    })
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ProblemDetail badRequestException(AbstractDomainException e) {
        var problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getDetails());
        problem.setTitle(e.getTitle());
        return problem;
    }

    @ExceptionHandler({
            MemberAlreadyExistsException.class,
            ProjectNameAlreadyUsedException.class,
            UsernameAlreadyUsedException.class
    })
    @ResponseStatus(HttpStatus.CONFLICT)
    public ProblemDetail conflictException(AbstractDomainException e) {
        var problem = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, e.getDetails());
        problem.setTitle(e.getTitle());
        return problem;
    }

    @ExceptionHandler({
            MemberNotFoundException.class,
            ProjectNotFoundException.class,
            UserNotFoundException.class
    })
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ProblemDetail notFoundException(AbstractDomainException e) {
        var problem = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getDetails());
        problem.setTitle(e.getTitle());
        return problem;
    }
}
