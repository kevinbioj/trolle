package fr.kevinbioj.trolle.view;

import fr.kevinbioj.trolle.model.task.TaskEntity;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

public record ProjectTaskView(UUID id,
                       String title,
                       String description,
                       MemberView assignee,
                       ColumnView column,
                       OffsetDateTime dueDate,
                       OffsetDateTime updatedAt,
                       OffsetDateTime createdAt) {

    public static ProjectTaskView from(TaskEntity task) {
        return new ProjectTaskView(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getAssignee() != null ? MemberView.from(task.getAssignee()) : null,
                ColumnView.from(task.getColumn()),
                task.getDueDate() != null ? task.getDueDate().atOffset(ZoneOffset.UTC) : null,
                task.getUpdatedAt().atOffset(ZoneOffset.UTC),
                task.getCreatedAt().atOffset(ZoneOffset.UTC));
    }
}
