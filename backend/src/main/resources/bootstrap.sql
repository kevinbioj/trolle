CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) UNIQUE NOT NULL,
    password BINARY(60) NOT NULL,
    display_name VARCHAR(40) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_user
        PRIMARY KEY (id)
);

CREATE TABLE project (
    id BINARY(16) NOT NULL DEFAULT UUID(),
    name VARCHAR(64) UNIQUE NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    owner_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_project
        PRIMARY KEY (id),
    CONSTRAINT fk_project_owner
        FOREIGN KEY (owner_id)
        REFERENCES user(id)
        ON DELETE CASCADE
);

CREATE TABLE `column` (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(32) NOT NULL,
    project_id BINARY(16) NOT NULL,
    CONSTRAINT pk_column PRIMARY KEY (id),
    CONSTRAINT fk_column_project
        FOREIGN KEY (project_id)
        REFERENCES project(id)
        ON DELETE CASCADE
);

CREATE TABLE member (
    id INT NOT NULL AUTO_INCREMENT,
    project_id BINARY(16) NOT NULL,
    user_id INT NOT NULL,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_member
        PRIMARY KEY (id),
    CONSTRAINT fk_member_project
        FOREIGN KEY (project_id)
        REFERENCES project(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_member_user
        FOREIGN KEY (user_id)
        REFERENCES user(id)
        ON DELETE CASCADE
);

CREATE TABLE task (
    id BINARY(16) NOT NULL DEFAULT UUID(),
    title VARCHAR(32) NOT NULL,
    description TEXT,
    project_id BINARY(16) NOT NULL,
    column_id INT NOT NULL,
    assignee_id INT,
    due_date TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT pk_task
        PRIMARY KEY (id),
    CONSTRAINT fk_task_project
        FOREIGN KEY (project_id)
        REFERENCES project(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_task_column
        FOREIGN KEY (column_id)
        REFERENCES `column`(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_task_assignee
        FOREIGN KEY (assignee_id)
        REFERENCES member(id)
        ON DELETE SET NULL
);
