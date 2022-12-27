package fr.kevinbioj.trolle.model.member;

import fr.kevinbioj.trolle.model.project.ProjectEntity;
import fr.kevinbioj.trolle.model.user.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.Objects;

@Getter
@Setter
@Entity
@Table(name = "member")
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        MemberEntity that = (MemberEntity) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

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
