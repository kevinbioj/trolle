package fr.kevinbioj.trolle.model.member.exception;

import fr.kevinbioj.trolle.model.AbstractDomainException;
import fr.kevinbioj.trolle.model.project.ProjectEntity;
import fr.kevinbioj.trolle.model.user.UserEntity;

public class MemberNotFoundException extends AbstractDomainException {

    public MemberNotFoundException(ProjectEntity project, UserEntity user) {
        super("MEMBER_NOT_FOUND", String.format(
                "User \"%s\" is not a member of project \"%s\".", user.getUsername(), project.getName()));
    }
}
