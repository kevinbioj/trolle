package fr.kevinbioj.trolle.view;

import fr.kevinbioj.trolle.model.task.TaskEntity;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

public record TaskView(UUID id,
                       String title,
                       String description,
                       SimpleProjectView project,
                       MemberView assignee,
                       Integer columnId,
                       OffsetDateTime dueDate,
                       OffsetDateTime updatedAt,
                       OffsetDateTime createdAt) {

    public static TaskView from(TaskEntity task) {
        return new TaskView(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                SimpleProjectView.from(task.getProject()),
                task.getAssignee() != null ? MemberView.from(task.getAssignee()) : null,
                task.getColumn().getId(),
                task.getDueDate() != null ? task.getDueDate().atOffset(ZoneOffset.UTC) : null,
                task.getUpdatedAt().atOffset(ZoneOffset.UTC),
                task.getCreatedAt().atOffset(ZoneOffset.UTC));
    }
}
