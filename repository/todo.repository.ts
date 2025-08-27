import { safeParse } from 'valibot';
import {
  TodoDbDTO,
  TodoDbSchema,
  TodoDTO,
  TodoUpdateDTO,
} from '../DTO/todo.dto.ts';
import { db } from '../database/index.ts';
import { todoKeys } from '../queries-key/index.ts';
import { ULID } from '../utils/ulid.ts';
import { TodoError } from '../errors/index.ts';

export const insertTodo = async (
  todoItem: TodoDTO,
  userId: ULID | undefined,
): Promise<TodoDbDTO> => {
  if (!userId) throw new Error('User ID is required to insert a todo item');
  const counterTodoKeys = todoKeys.counter(userId);
  const tx = await db.atomic().sum(counterTodoKeys, 1n).commit();
  if (!tx.ok) throw new TodoError('Could not increment todo counter');

  const { value: currentCount } = await db.getEntry<Deno.KvU64>(
    counterTodoKeys,
  );
  const newTodoId = currentCount?.value ?? 1n;

  const { success, output: newTodo } = safeParse(
    TodoDbSchema(newTodoId),
    todoItem,
  );
  if (!success) throw new TodoError('Invalid todo item for database insertion');
  await db.upsertEntry(todoKeys.todo(newTodoId), newTodo);
  return newTodo;
};

export const updateTodoDb = async (
  todoItem: TodoUpdateDTO,
  idTodo: number,
): Promise<TodoDbDTO> => {
  const todoKey = todoKeys.todo(BigInt(idTodo));
  const existingEntry = await db.getEntry<TodoDbDTO>(
    todoKey,
  );

  if (!existingEntry.value) {
    throw new TodoError('Todo item not found');
  }

  const updateTodo = { ...existingEntry.value, ...todoItem };

  const tx = await db.atomic().check(existingEntry).set(todoKey, updateTodo)
    .commit();
  if (!tx.ok) {
    throw new TodoError(
      'The todo item was modified by another request. Please try again.',
    );
  }
  return updateTodo;
};
