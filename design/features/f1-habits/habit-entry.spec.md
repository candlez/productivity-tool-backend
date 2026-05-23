# Habit Entry Specification

Table Name: habit_entry

| Name | Type | Details |
| ---- | ---- | ------- |
| habit_entry_id | UUID | primary key |
| habit_id | UUID | foreign key (habit) |
| user_id | UUID | foreign key (users) |
| entry_date | DATE | |
| value | BOOLEAN | |
