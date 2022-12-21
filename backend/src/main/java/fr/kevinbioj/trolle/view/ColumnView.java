package fr.kevinbioj.trolle.view;

import fr.kevinbioj.trolle.model.column.ColumnEntity;

public record ColumnView(Integer id, String name) {

    public static ColumnView from(ColumnEntity column) {
        return new ColumnView(column.getId(), column.getName());
    }
}
