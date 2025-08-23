import { DatabaseLayer } from '../database/index.ts';
import { RegisterDTO } from '../DTO/auth.dto.ts';

const db = await DatabaseLayer.getInstance();
