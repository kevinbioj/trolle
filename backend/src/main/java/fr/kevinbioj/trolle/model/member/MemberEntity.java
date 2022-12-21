package fr.kevinbioj.trolle.model.member;

import fr.kevinbioj.trolle.model.project.ProjectEntity;
import fr.kevinbioj.trolle.model.user.UserEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Data @EqualsAndHashCode(of = "id") @ToString(of = "id")
@Entity @Table(name = "member")
public class MemberEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    private ProjectEntity project;

    @ManyToOne(optional = false)
    private UserEntity user;

    @Column(columnDefinition = "TIMESTAMP", nullable = false)
    @CreationTimestamp
    private Instant joinedAt;

    // ---

    /**
     * Crée une entité membre avec les informations initiales fournies.
     *
     * @param project Projet auquel ajouter un membre.
     * @param user    Utilisateur à rajouter au projet.
     */
    public static MemberEntity create(ProjectEntity project, UserEntity user) {
        var member = new MemberEntity();
        member.setProject(project);
        member.setUser(user);
        return member;
    }
}
