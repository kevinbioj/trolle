package fr.kevinbioj.trolle.model.column;

import fr.kevinbioj.trolle.model.column.exception.ColumnNotFoundException;
import fr.kevinbioj.trolle.model.project.ProjectEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@AllArgsConstructor
@Service
public class ColumnService {

    private final ColumnRepository columnRepository;

    // ---

    /**
     * Crée une nouvelle colonne vierge rattachée à un projet.
     *
     * @param name    Nom de la colonne.
     * @param project Projet auquel la colonne appartient.
     */
    public ColumnEntity create(String name, ProjectEntity project) {
        var column = ColumnEntity.create(name, project);
        project.getColumns().add(column);
        return columnRepository.save(column);
    }

    /**
     * Récupère une colonne à l'aide de son projet et de son identifiant.
     *
     * @param project Projet dans lequel la colonne se trouve.
     * @param id      Colonne à récupérer dans le projet cible.
     */
    public ColumnEntity get(ProjectEntity project, Integer id) {
        return columnRepository
                .findByProjectAndId(project, id)
                .orElseThrow(() -> new ColumnNotFoundException(project, id));
    }
}
