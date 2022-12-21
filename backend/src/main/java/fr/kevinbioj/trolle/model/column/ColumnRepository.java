package fr.kevinbioj.trolle.model.column;

import fr.kevinbioj.trolle.model.project.ProjectEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface ColumnRepository extends CrudRepository<ColumnEntity, Integer> {

    Optional<ColumnEntity> findByProjectAndId(ProjectEntity project, Integer id);
}
