package fr.kevinbioj.trolle.model.project;

import fr.kevinbioj.trolle.model.user.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Set;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<ProjectEntity, UUID> {

    boolean existsByNameIgnoreCase(String name);

    @SuppressWarnings("SpringDataMethodInconsistencyInspection")
    Set<ProjectEntity> findAllByIsPublicTrue();

    @Query("SELECT p FROM ProjectEntity p WHERE p.owner = ?1 OR p IN (SELECT m.project FROM MemberEntity m WHERE m.user = ?1)")
    Set<ProjectEntity> findAllInvolving(UserEntity user);
}
