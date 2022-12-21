package fr.kevinbioj.trolle.model.member;

import fr.kevinbioj.trolle.model.member.exception.MemberAlreadyExistsException;
import fr.kevinbioj.trolle.model.member.exception.MemberNotFoundException;
import fr.kevinbioj.trolle.model.project.ProjectEntity;
import fr.kevinbioj.trolle.model.user.UserEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@AllArgsConstructor
@Service
public class MemberService {

    private final MemberRepository memberRepository;

    // ---

    /**
     * Crée une relation de membre entre un projet et un utilisateur.
     *
     * @param project Projet accueillant le membre.
     * @param user    Utilisateur souhaitant devenir membre.
     */
    public MemberEntity create(ProjectEntity project, UserEntity user) {
        if (memberRepository.existsByProjectAndUser(project, user))
            throw new MemberAlreadyExistsException(project, user);
        var member = MemberEntity.create(project, user);
        return memberRepository.save(member);
    }

    /**
     * Supprime une relation de membre entre un projet et un utilisateur.
     *
     * @param member Membre à supprimer.
     */
    public void delete(MemberEntity member) {
        memberRepository.delete(member);
    }

    /**
     * Renvoie la liste de tous les membres d'un projet.
     *
     * @param project Projet pour lequel récupérer les membres.
     */
    public Set<MemberEntity> find(ProjectEntity project) {
        return memberRepository.findAllByProject(project);
    }

    /**
     * Récupère un membre à l'aide du projet et de l'utilisateur.
     *
     * @param project Projet duquel récupérer un membre.
     * @param user    Utilisateur représenté par le membre.
     */
    public MemberEntity get(ProjectEntity project, UserEntity user) {
        return memberRepository.findByProjectAndUser(project, user)
                .orElseThrow(() -> new MemberNotFoundException(project, user));
    }
}
