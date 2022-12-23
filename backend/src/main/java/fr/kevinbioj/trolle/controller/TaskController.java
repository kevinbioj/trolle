package fr.kevinbioj.trolle.controller;

import fr.kevinbioj.trolle.model.column.ColumnService;
import fr.kevinbioj.trolle.model.member.MemberService;
import fr.kevinbioj.trolle.model.project.ProjectService;
import fr.kevinbioj.trolle.model.task.TaskEntity;
import fr.kevinbioj.trolle.model.task.TaskService;
import fr.kevinbioj.trolle.model.user.UserService;
import fr.kevinbioj.trolle.view.TaskView;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final ColumnService columnService;
    private final MemberService memberService;
    private final ProjectService projectService;
    private final TaskService taskService;
    private final UserService userService;

    // --- PERMIT ALL ENDPOINTS

    @GetMapping("/{id}")
    public TaskView get(Authentication auth, @PathVariable UUID id) {
        var user = userService.get(auth.getName());
        var task = taskService.get(id);
        if (!task.isVisibleBy(user))
            throw new AccessDeniedException("You are not allowed to view this task");
        return TaskView.from(task);
    }

    // --- AUTHENTICATED ENDPOINTS

    @GetMapping("/involved")
    public List<TaskView> findAllInvolving(Authentication auth) {
        var user = userService.get(auth.getName());
        var tasks = taskService.findAllInvolving(user);
        return tasks.stream().map(TaskView::from).toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskView create(Authentication auth, @RequestBody @Valid CreateTaskDto data) {
        var user = userService.get(auth.getName());
        var project = projectService.get(data.projectId());
        if (!project.isManageableBy(user))
            throw new AccessDeniedException("You are not allowed to manage this project.");
        var column = columnService.get(project, data.columnId());
        var task = taskService.create(data.title(), project, column);
        return TaskView.from(task);
    }

    @PatchMapping("/{id}")
    public TaskView update(Authentication auth, @PathVariable UUID id, @RequestBody @Valid UpdateTaskDto data) {
        var user = userService.get(auth.getName());
        var task = taskService.get(id);
        if (!task.isManageableBy(user))
            throw new AccessDeniedException("You are not allowed to manage this task.");
        if (data.assignee() != null
                && !data.assignee().equals("")
                && !data.assignee().equals(user.getUsername())
                && task.isManageableBy(user))
            throw new AccessDeniedException("You are not allowed to assign someone else.");
        var updated = taskService.update(
                task,
                data.title(),
                data.description(),
                data.columnId() != null ? columnService.get(task.getProject(), data.columnId()) : task.getColumn(),
                data.assignee() != null
                        ? data.assignee().equals("")
                        ? null
                        : memberService.get(task.getProject(), userService.get(data.assignee()))
                        : task.getAssignee(),
                data.dueDate() != null
                        ? data.dueDate().equals("") ? null : LocalDateTime.parse(data.dueDate())
                        : task.getDueDate());
        return TaskView.from(updated);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(Authentication auth, @PathVariable UUID id) {
        var user = userService.get(auth.getName());
        var task = taskService.get(id);
        if (!task.isManageableBy(user))
            throw new AccessDeniedException("You are not allowed to manage this task.");
        taskService.delete(task);
    }

    // --- DATA TRANSFER OBJECTS

    private record CreateTaskDto(@NotNull @Pattern(regexp = TaskEntity.TITLE_PATTERN) String title,
                                 @NotNull UUID projectId,
                                 @NotNull Integer columnId) {
    }

    private record UpdateTaskDto(@Pattern(regexp = TaskEntity.DESCRIPTION_PATTERN) String description,
                                 @Pattern(regexp = TaskEntity.TITLE_PATTERN) String title,
                                 String assignee,
                                 Integer columnId,
                                 String dueDate) {
    }
}
