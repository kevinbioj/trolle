package fr.kevinbioj.trolle.view;

import fr.kevinbioj.trolle.model.project.ProjectEntity;

import java.util.UUID;

public record SimpleProjectView(UUID id, String name) {

    public static SimpleProjectView from(ProjectEntity project) {
        return new SimpleProjectView(project.getId(), project.getName());
    }
}
