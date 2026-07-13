# Habit Specification

Table Name: habit

| Name | Type | Details |
| ---- | ---- | ------- |
| habit_id | UUID | primary key |
| user_id | UUID | foreign key (users) |
| pillar_id | UUID | foreign key (pillars) |
| name | VARCHAR(100) | |
| description | TEXT | |
| active | BOOLEAN | |
| created_at | TIMESTAMP | |
