import { Simplify } from '@gdquest/type-fest';
import { InferOutput, object, pipe, string, transform } from 'valibot';

export const TodoSchema = object({
  title: string(),
  description: string(),
});

export const TodoDbSchema = (id: bigint) =>
  pipe(
    TodoSchema,
    transform((data): TodoDTO & { id: bigint } => ({ ...data, id })),
  );

export type TodoDTO = InferOutput<typeof TodoSchema>;
export type TodoDbDTO = Simplify<InferOutput<ReturnType<typeof TodoDbSchema>>>;
export type TodoResponse = Omit<TodoDbDTO, 'id'> & { id: number };
