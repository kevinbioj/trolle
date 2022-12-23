package fr.kevinbioj.trolle.model.project;

import fr.kevinbioj.trolle.model.project.exception.ProjectNameAlreadyUsedException;
import fr.kevinbioj.trolle.model.project.exception.ProjectNotFoundException;
import fr.kevinbioj.trolle.model.user.UserEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@AllArgsConstructor
@Service
public class ProjectService {

    private final ProjectRepository projectRepository;

    // ---

    /**
     * Crée un nouveau projet dans l'application.
     *
     * @param name  Nom du projet.
     * @param owner Gérant du projet.
     */
    public ProjectEntity create(String name, UserEntity owner) {
        if (projectRepository.existsByNameIgnoreCase(name))
            throw new ProjectNameAlreadyUsedException(name);
        var project = ProjectEntity.create(name, owner);
        return projectRepository.save(project);
    }

    /**
     * Supprime un projet de l'application.
     *
     * @param project Projet à supprimer.
     */
    public void delete(ProjectEntity project) {
        projectRepository.delete(project);
    }

    /**
     * Récupère l'ensemble des projets impliquant (membre ou gérant) l'utilisateur fourni.
     *
     * @param user Utilisateur pour qui rechercher ses projets.
     */
    public Set<ProjectEntity> findAllInvolving(UserEntity user) {
        return projectRepository.findAllInvolving(user);
    }

    /**
     * Récupère l'ensemble des projets visibles par tout le monde.
     */
    public Set<ProjectEntity> findAllPublic() {
        return projectRepository.findAllByIsPublicTrue();
    }

    /**
     * Récupère un projet à l'aide de son identifiant.
     *
     * @param id Identifiant du projet.
     */
    public ProjectEntity get(UUID id) {
        return projectRepository.findById(id).orElseThrow(() -> new ProjectNotFoundException(id));
    }

    /**
     * Met à jour le projet cible avec les nouvelles informations.
     *
     * @param project  Projet à mettre à jour.
     * @param name     Nouveau nom du projet.
     * @param isPublic Nouveau statut de visibilité publique du projet.
     */
    public ProjectEntity update(ProjectEntity project, String name, Boolean isPublic) {
        project.setName(name);
        project.setPublic(isPublic);
        return projectRepository.save(project);
    }
}
