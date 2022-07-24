import {OutputOption} from './types';
import {LiveConnection} from './live_connection';

let connection: LiveConnection | null = null;

export const registerConnection = (conn: LiveConnection) => {
  connection = conn;
};

export const listOutputOptions = async (): Promise<OutputOption[]> => {
  const res = await connection!.sendRequest({}, 'list_outputs');
  return [];
};
