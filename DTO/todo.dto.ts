import { Simplify } from '@gdquest/type-fest';
import {
  InferOutput,
  object,
  partial,
  pipe,
  strictObject,
  string,
  transform,
} from 'valibot';

export const TodoSchema = object({
  title: string(),
  description: string(),
});

export const TodoDbSchema = (id: bigint) =>
  pipe(
    TodoSchema,
    transform((data): TodoDTO & { id: bigint } => ({ ...data, id })),
  );

export const TodoUpdateSchema = partial(strictObject(TodoSchema.entries));

export type TodoDTO = InferOutput<typeof TodoSchema>;
export type TodoDbDTO = Simplify<InferOutput<ReturnType<typeof TodoDbSchema>>>;
export type TodoResponse = Omit<TodoDbDTO, 'id'> & { id: number };
export type TodoUpdateDTO = InferOutput<typeof TodoUpdateSchema>;
