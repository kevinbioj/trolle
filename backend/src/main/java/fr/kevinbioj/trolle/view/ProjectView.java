package fr.kevinbioj.trolle.view;

import fr.kevinbioj.trolle.model.project.ProjectEntity;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.UUID;

public record ProjectView(UUID id,
                          String name,
                          UserView owner,
                          Boolean isPublic,
                          List<ColumnView> columns,
                          OffsetDateTime createdAt) {

    public static ProjectView from(ProjectEntity project) {
        return new ProjectView(
                project.getId(),
                project.getName(),
                UserView.from(project.getOwner()),
                project.isPublic(),
                project.getColumns().stream().sorted().map(ColumnView::from).toList(),
                project.getCreatedAt().atOffset(ZoneOffset.UTC));
    }
}
