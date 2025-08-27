import { Handler } from '@std/http/unstable-route';
import { bodyParse } from '../utils/body-parse.ts';
import {
  TodoDbDTO,
  TodoResponse,
  TodoSchema,
  TodoUpdateSchema,
} from '../DTO/todo.dto.ts';
import { flatten } from 'valibot';
import { insertTodo, updateTodoDb } from '../repository/todo.repository.ts';
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
    return Response.json(
      flatten<typeof TodoSchema>(issues),
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

export const updateTodo: Handler = async (req, params) => {
  const { issues, output: todoData, success } = await bodyParse(
    req,
    TodoUpdateSchema,
  );
  if (!success) {
    return Response.json(
      flatten<typeof TodoUpdateSchema>(issues),
      { status: STATUS_CODE.BadRequest },
    );
  }
  const idTodo = params?.pathname.groups.id
    ? Number(params.pathname.groups.id)
    : undefined;

  if (!idTodo || idTodo <= 0) {
    return Response.json(
      { message: 'Invalid todo ID' },
      { status: STATUS_CODE.BadRequest },
    );
  }

  const { data, error } = await tryCatch<TodoDbDTO, TodoError>(
    updateTodoDb(todoData, idTodo),
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
