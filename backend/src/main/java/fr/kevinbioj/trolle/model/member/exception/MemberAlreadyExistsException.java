package fr.kevinbioj.trolle.model.member.exception;

import fr.kevinbioj.trolle.model.AbstractDomainException;
import fr.kevinbioj.trolle.model.project.ProjectEntity;
import fr.kevinbioj.trolle.model.user.UserEntity;

public class MemberAlreadyExistsException extends AbstractDomainException {

    public MemberAlreadyExistsException(ProjectEntity project, UserEntity user) {
        super("MEMBER_ALREADY_EXISTS", String.format(
                "User \"%s\" is already a member of project \"%s\".", user.getUsername(), project.getName()));
    }
}
