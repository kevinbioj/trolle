package fr.kevinbioj.trolle.model.member;

import fr.kevinbioj.trolle.model.project.ProjectEntity;
import fr.kevinbioj.trolle.model.user.UserEntity;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;
import java.util.Set;

public interface MemberRepository extends CrudRepository<MemberEntity, Integer> {

    boolean existsByProjectAndUser(ProjectEntity project, UserEntity user);

    Set<MemberEntity> findAllByProject(ProjectEntity project);

    Optional<MemberEntity> findByProjectAndUser(ProjectEntity project, UserEntity user);
}
