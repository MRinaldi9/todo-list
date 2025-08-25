import { ULID } from '../utils/ulid.ts';

export const PrimaryKey = {
  Users: 'users',
  UsersEmail: 'usersEmail',
  Todos: 'todos',
  TodosCounter: 'todosCounter',
} as const;

export const authKeys = {
  userEmail: (email: string) => [PrimaryKey.UsersEmail, email] as const,
  user: (id: ULID) => [PrimaryKey.Users, id] as const,
} as const;

export const todoKeys = {
  todo: (id: bigint) => [PrimaryKey.Todos, id] as const,
  counter: (userId: ULID) => [PrimaryKey.TodosCounter, userId] as const,
} as const;
