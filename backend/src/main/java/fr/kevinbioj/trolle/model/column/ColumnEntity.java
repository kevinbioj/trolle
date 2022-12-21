package fr.kevinbioj.trolle.model.column;

import fr.kevinbioj.trolle.model.column.exception.InvalidColumnNameException;
import fr.kevinbioj.trolle.model.project.ProjectEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.regex.Pattern;

@Data @EqualsAndHashCode(of = "id") @ToString(of = "id")
@Entity @Table(name = "`column`")
public class ColumnEntity implements Comparable<ColumnEntity> {

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

    @Override
    public int compareTo(ColumnEntity o) {
        return id.compareTo(o.id);
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
