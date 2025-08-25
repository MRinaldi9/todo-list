import { Handler } from '@std/http/unstable-route';
import { bodyParse } from '../utils/body-parse.ts';
import { TodoDbDTO, TodoResponse, TodoSchema } from '../DTO/todo.dto.ts';
import { flatten } from 'valibot';
import { insertTodo } from '../repository/todo.repository.ts';
import { jwtService } from './jwt.ts';
import { tryCatch } from '../utils/try-catch.ts';
import { TodoError } from '../errors/index.ts';
import { STATUS_CODE } from '@std/http';

function handlerTodoDb(todoItem: TodoDbDTO): TodoResponse {
  return { ...todoItem, id: Number(todoItem.id) };
}

export const createTodo: Handler = async (req): Promise<Response> => {
  const { issues, output: todoData, success } = await bodyParse(
    req,
    TodoSchema,
  );
  if (!success) {
    return new Response(
      JSON.stringify(
        flatten<typeof TodoSchema>(issues),
      ),
      { status: STATUS_CODE.BadRequest },
    );
  }
  const { data, error } = await tryCatch<TodoDbDTO, TodoError>(
    insertTodo(todoData, jwtService.payloadToken?.sub),
  );
  if (error) {
    return Response.json({
      message: error.message,
    });
  }

  return Response.json(
    handlerTodoDb(data),
  );
};
