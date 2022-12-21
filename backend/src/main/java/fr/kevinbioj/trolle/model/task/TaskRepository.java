package fr.kevinbioj.trolle.model.task;

import fr.kevinbioj.trolle.model.project.ProjectEntity;
import fr.kevinbioj.trolle.model.user.UserEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Set;
import java.util.UUID;

public interface TaskRepository extends CrudRepository<TaskEntity, UUID> {

    Set<TaskEntity> findAllByProject(ProjectEntity project);

    @Query("SELECT t FROM TaskEntity t WHERE t.assignee IN (SELECT m FROM MemberEntity m WHERE m.user = ?1)")
    Set<TaskEntity> findAllByUser(UserEntity user);
}
