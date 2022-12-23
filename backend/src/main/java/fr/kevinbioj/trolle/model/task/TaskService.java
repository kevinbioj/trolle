package fr.kevinbioj.trolle.model.task;

import fr.kevinbioj.trolle.model.column.ColumnEntity;
import fr.kevinbioj.trolle.model.member.MemberEntity;
import fr.kevinbioj.trolle.model.project.ProjectEntity;
import fr.kevinbioj.trolle.model.task.exception.TaskNotFoundException;
import fr.kevinbioj.trolle.model.user.UserEntity;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@AllArgsConstructor
@Service
public class TaskService {

    private final TaskRepository taskRepository;

    // ---

    /**
     * Crée une nouvelle tâche dans le projet et la colonne définie.
     *
     * @param title   Titre de la tâche.
     * @param project Projet auquel la tâche est rattachée.
     * @param column  Colonne dans laquelle la tâche se trouve initialement.
     */
    public TaskEntity create(String title, ProjectEntity project, ColumnEntity column) {
        var task = TaskEntity.create(title, project, column);
        return taskRepository.save(task);
    }

    /**
     * Supprime une tâche de l'application.
     *
     * @param task Tâche à supprimer.
     */
    public void delete(TaskEntity task) {
        taskRepository.delete(task);
    }

    /**
     * Récupère toutes les tâches affectées à l'utilisateur fourni.
     *
     * @param user Utilisateur pour qui récupérer les tâches affectées.
     */
    public Set<TaskEntity> findAllInvolving(UserEntity user) {
        return taskRepository.findAllByUser(user);
    }

    /**
     * Récupère toutes les tâches présentes dans le projet donnée.
     *
     * @param project Projet pour lequel récupérer les tâches.
     */
    public Set<TaskEntity> findAllByProject(ProjectEntity project) {
        return taskRepository.findAllByProject(project);
    }

    /**
     * Récupère une tâche à l'aide de son identifiant.
     *
     * @param id Identifiant de la tâche.
     */
    public TaskEntity get(UUID id) {
        return taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
    }

    /**
     * Met à jour une tâche avec les nouvelles informations fournies.
     *
     * @param task        Tâche à mettre à jour.
     * @param title       Nouveau titre de la tâche (facultatif).
     * @param description Nouvelle description de la tâche (facultative).
     * @param column      Nouvelle colonne de la tâche (facultative).
     * @param assignee    Nouvel affecté à la tâche (facultatif).
     */
    public TaskEntity update(TaskEntity task, String title, String description, ColumnEntity column, MemberEntity assignee, LocalDateTime dueDate) {
        task.setTitle(title);
        task.setDescription(description);
        task.setColumn(column);
        task.setAssignee(assignee);
        task.setDueDate(dueDate);
        return taskRepository.save(task);
    }
}
