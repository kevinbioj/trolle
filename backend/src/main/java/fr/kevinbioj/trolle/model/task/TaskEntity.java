package fr.kevinbioj.trolle.model.task;

import fr.kevinbioj.trolle.model.column.ColumnEntity;
import fr.kevinbioj.trolle.model.member.MemberEntity;
import fr.kevinbioj.trolle.model.project.ProjectEntity;
import fr.kevinbioj.trolle.model.task.exception.InvalidTaskDescriptionException;
import fr.kevinbioj.trolle.model.task.exception.InvalidTaskTitleException;
import fr.kevinbioj.trolle.model.user.UserEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;
import java.util.regex.Pattern;

@Getter
@Setter
@Entity
@Table(name = "task")
public class TaskEntity {

    public static final String TITLE_PATTERN = "^.{2,32}$";
    public static final String DESCRIPTION_PATTERN = "^.{0,2048}$";

    // ---

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(columnDefinition = "VARCHAR(32)", nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    @Lob
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private ProjectEntity project;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private ColumnEntity column;

    @ManyToOne
    private MemberEntity assignee;

    @Column(columnDefinition = "DATETIME")
    private LocalDateTime dueDate;

    @Column(columnDefinition = "TIMESTAMP", nullable = false)
    @UpdateTimestamp
    private Instant updatedAt;

    @Column(columnDefinition = "TIMESTAMP", nullable = false)
    @CreationTimestamp
    private Instant createdAt;

    // ---

    public void setTitle(String title) {
        if (!Pattern.matches(TITLE_PATTERN, title))
            throw new InvalidTaskTitleException(title);
        this.title = title;
    }

    public void setDescription(String description) {
        if (description != null && !Pattern.matches(DESCRIPTION_PATTERN, description))
            throw new InvalidTaskDescriptionException();
        this.description = description;
    }


    // ---

    /**
     * Indique si l'utilisateur cible est en mesure de gérer la tâche.
     *
     * @param user Utilisateur souhaitant gérer la tâche.
     */
    public boolean isManageableBy(UserEntity user) {
        if (getAssignee() != null && getAssignee().getUser().equals(user)) return true;
        return getProject().isManageableBy(user);
    }

    /**
     * Indique si l'utilisateur cible est en mesure de voir la tâche.
     *
     * @param user Utilisateur souhaitant voir la tâche.
     */
    public boolean isVisibleBy(UserEntity user) {
        return getProject().isVisibleBy(user);
    }

    // ---

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        TaskEntity that = (TaskEntity) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    // ---

    /**
     * Crée une nouvelle entité tâche avec les informations initiales fournies.
     *
     * @param title   Titre de la tâche.
     * @param project Projet de la tâche.
     * @param column  Colonne de la tâche.
     */
    public static TaskEntity create(String title, ProjectEntity project, ColumnEntity column) {
        var task = new TaskEntity();
        task.setTitle(title);
        task.setProject(project);
        task.setColumn(column);
        return task;
    }
}
