package fr.kevinbioj.trolle.controller;

import fr.kevinbioj.trolle.model.column.ColumnService;
import fr.kevinbioj.trolle.model.member.MemberService;
import fr.kevinbioj.trolle.model.project.ProjectEntity;
import fr.kevinbioj.trolle.model.project.ProjectService;
import fr.kevinbioj.trolle.model.task.TaskService;
import fr.kevinbioj.trolle.model.user.UserService;
import fr.kevinbioj.trolle.view.ProjectTaskView;
import fr.kevinbioj.trolle.view.ProjectView;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ColumnService columnService;
    private final MemberService memberService;
    private final ProjectService projectService;
    private final TaskService taskService;
    private final UserService userService;

    // --- PERMIT ALL ENDPOINTS

    @GetMapping("/{id}")
    public ProjectView get(Authentication auth, @PathVariable UUID id) {
        var user = auth != null ? userService.get(auth.getName()) : null;
        var project = projectService.get(id);
        if (!project.isVisibleBy(user))
            throw new AccessDeniedException("You are not allowed to view this project.");
        return ProjectView.from(project);
    }

    @GetMapping("/{id}/tasks")
    public List<ProjectTaskView> findAll(Authentication auth, @PathVariable UUID id) {
        var user = auth != null ? userService.get(auth.getName()) : null;
        var project = projectService.get(id);
        if (!project.isVisibleBy(user))
            throw new AccessDeniedException("You are not allowed to view this project.");
        var tasks = taskService.findAllByProject(project);
        return tasks.stream().map(ProjectTaskView::from).toList();
    }

    @GetMapping("/public")
    public List<ProjectView> findAllPublic() {
        var projects = projectService.findAllPublic();
        return projects.stream().map(ProjectView::from).toList();
    }

    // --- AUTHENTICATED ENDPOINTS

    @GetMapping("/involved")
    public List<ProjectView> findAllInvolved(Authentication auth) {
        var user = userService.get(auth.getName());
        var projects = projectService.findAllInvolving(user);
        return projects.stream().map(ProjectView::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectView create(Authentication auth, @RequestBody @Valid CreateProjectDto data) {
        var user = userService.get(auth.getName());
        var project = projectService.create(data.name(), user);
        memberService.create(project, user);
        columnService.create("Stories", project);
        data.columns().forEach(c -> columnService.create(c, project));
        columnService.create("Terminées", project);
        return ProjectView.from(project);
    }

    @PatchMapping("/{id}")
    public ProjectView update(Authentication auth, @PathVariable UUID id, @RequestBody @Valid UpdateProjectDto data) {
        var user = userService.get(auth.getName());
        var project = projectService.get(id);
        if (!project.isManageableBy(user))
            throw new AccessDeniedException("You are not allowed to manage this project.");
        var updated = projectService.update(project,
                data.name() != null ? data.name() : project.getName(),
                data.isPublic() != null ? data.isPublic() : project.isPublic());
        return ProjectView.from(updated);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication auth, @PathVariable UUID id) {
        var user = userService.get(auth.getName());
        var project = projectService.get(id);
        if (!project.isManageableBy(user))
            throw new AccessDeniedException("You are not allowed to manage this project.");
        projectService.delete(project);
    }

    // --- DATA TRANSFER OBJECTS

    private record CreateProjectDto(@NotNull @Pattern(regexp = ProjectEntity.NAME_PATTERN) String name,
                                    @NotNull List<String> columns) {
    }

    private record UpdateProjectDto(@Pattern(regexp = ProjectEntity.NAME_PATTERN) String name,
                                    Boolean isPublic) {
    }
}
