package fr.kevinbioj.trolle.controller;

import fr.kevinbioj.trolle.model.member.MemberService;
import fr.kevinbioj.trolle.model.project.ProjectService;
import fr.kevinbioj.trolle.model.user.UserService;
import fr.kevinbioj.trolle.view.MemberView;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/projects/{projectId}/members")
public class MemberController {

    private final MemberService memberService;
    private final ProjectService projectService;
    private final UserService userService;

    // ---

    @GetMapping
    public List<MemberView> findAll(Authentication auth, @PathVariable UUID projectId) {
        var user = auth != null ? userService.get(auth.getName()) : null;
        var project = projectService.get(projectId);
        if (!project.isVisibleBy(user))
            throw new AccessDeniedException("You are not allowed to view this project.");
        var members = memberService.find(project);
        return members.stream().map(MemberView::from).toList();
    }

    @GetMapping("/{username}")
    public MemberView find(Authentication auth, @PathVariable UUID projectId, @PathVariable String username) {
        var user = auth != null ? userService.get(auth.getName()) : null;
        var project = projectService.get(projectId);
        if (!project.isVisibleBy(user))
            throw new AccessDeniedException("You are not allowed to view this project.");
        var member = memberService.get(project, userService.get(username));
        return MemberView.from(member);
    }

    @PutMapping("/{username}")
    @ResponseStatus(HttpStatus.CREATED)
    public MemberView addMember(Authentication auth, @PathVariable UUID projectId, @PathVariable String username) {
        var user = userService.get(auth.getName());
        var project = projectService.get(projectId);
        if (!project.isManageableBy(user))
            throw new AccessDeniedException("You are not allowed to manage this project.");
        var member = memberService.create(project, userService.get(username));
        return MemberView.from(member);
    }

    @DeleteMapping("/{username}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void removeMember(Authentication auth, @PathVariable UUID projectId, @PathVariable String username) {
        var user = userService.get(auth.getName());
        var project = projectService.get(projectId);
        if (!project.isManageableBy(user))
            throw new AccessDeniedException("You are not allowed to manage this project.");
        var target = userService.get(username);
        if (project.getOwner().equals(target))
            throw new AccessDeniedException("You are not allowed to remove this member.");
        var member = memberService.get(project, target);
        memberService.delete(member);
    }
}
