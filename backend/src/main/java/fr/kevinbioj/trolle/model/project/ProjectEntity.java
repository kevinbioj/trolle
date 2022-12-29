package fr.kevinbioj.trolle.model.project;

import fr.kevinbioj.trolle.model.column.ColumnEntity;
import fr.kevinbioj.trolle.model.member.MemberEntity;
import fr.kevinbioj.trolle.model.project.exception.InvalidProjectNameException;
import fr.kevinbioj.trolle.model.user.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

@Getter
@Setter
@Entity
@Table(name = "project")
public class ProjectEntity {

    public static final String NAME_PATTERN = "^.{4,64}$";

    // ---

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(columnDefinition = "VARCHAR(64)", nullable = false, unique = true)
    private String name;

    @ManyToOne(optional = false)
    private UserEntity owner;

    @OneToMany(mappedBy = "project", orphanRemoval = true)
    private Set<ColumnEntity> columns = new HashSet<>();

    @OneToMany(mappedBy = "project", orphanRemoval = true)
    private Set<MemberEntity> members = new HashSet<>();

    @Column(columnDefinition = "BOOLEAN", nullable = false)
    private boolean isPublic;

    @Column(columnDefinition = "TIMESTAMP", nullable = false, updatable = false)
    @CreationTimestamp
    private Instant createdAt;

    // ---

    public void setName(String name) {
        if (!Pattern.matches(NAME_PATTERN, name))
        this.name = name;
    }

    // ---

    /**
     * Indique si le projet est gérable par l'utilisateur cible.
     *
     * @param user Utilisateur souhaitant gérer le projet.
     */
    public boolean isManageableBy(UserEntity user) {
        return owner.equals(user);
    }

    /**
     * Indique si le projet est visible par l'utilisateur cible.
     *
     * @param user Utilisateur souhaitant voir le projet.
     */
    public boolean isVisibleBy(UserEntity user) {
        if (isPublic) return true;
        if (owner.equals(user)) return true;
        return getMembers().contains(user);
    }

    // ---

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ProjectEntity that = (ProjectEntity) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    // ---

    /**
     * Crée une entité projet avec les informations initiales fournies.
     *
     * @param name  Nom du projet.
     * @param owner Gérant du projet.
     */
    public static ProjectEntity create(String name, UserEntity owner) {
        var project = new ProjectEntity();
        project.setName(name);
        project.setOwner(owner);
        return project;
    }
}
