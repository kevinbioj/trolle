package fr.kevinbioj.trolle.model.column;

import fr.kevinbioj.trolle.model.column.exception.InvalidColumnNameException;
import fr.kevinbioj.trolle.model.project.ProjectEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.Hibernate;

import java.util.Objects;
import java.util.regex.Pattern;

@Getter
@Setter
@Entity
@Table(name = "`column`")
public class ColumnEntity {

    public static final String NAME_PATTERN = "^.{2,32}$";

    // ---

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(optional = false)
    private ProjectEntity project;

    @Column(columnDefinition = "VARCHAR(32)", nullable = false)
    private String name;

    // ---

    public void setName(String name) {
        if (!Pattern.matches(NAME_PATTERN, name))
            throw new InvalidColumnNameException(name);
        this.name = name;
    }

    // ---

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ColumnEntity that = (ColumnEntity) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    // ---

    /**
     * Crée une entité colonne avec les informations initiales fournies.
     *
     * @param name    Nom de la colonne.
     * @param project Projet auquel la colonne appartient.
     */
    public static ColumnEntity create(String name, ProjectEntity project) {
        var column = new ColumnEntity();
        column.setName(name);
        column.setProject(project);
        return column;
    }
}
