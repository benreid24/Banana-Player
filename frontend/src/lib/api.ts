import {OutputOption, OutputOptions, PlayerConfig} from './types';
import {LiveConnection} from './live_connection';

let connection: LiveConnection | null = null;

const dummy = true;
let dummyConfig: PlayerConfig | null = null;

export const registerConnection = (conn: LiveConnection) => {
  connection = conn;
};

export const listOutputOptions = async (): Promise<OutputOptions> => {
  if (dummy) {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      localDevices: [
        {
          name: 'Speakers',
          identifier: 'speaker1'
        },
        {
          name: 'Monitor',
          identifier: 'monitor1'
        }
      ],
      renderers: [
        {
          name: 'Mega Dank Zone',
          identifier: 'mdz'
        },
        {
          name: 'Smart TV',
          identifier: 'tv1'
        }
      ]
    };
  }

  const res = await connection!.sendRequest({}, 'list_outputs');
  return res as OutputOptions;
};

export const setPlayerConfig = async (config: PlayerConfig): Promise<void> => {
  if (dummy) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    dummyConfig = config;
    return;
  }

  await connection!.sendRequest(config, 'set_output');
};

export const getPlayerConfig = async (): Promise<PlayerConfig> => {
  if (dummy) {
    return dummyConfig ? dummyConfig : {};
  }

  const res = await connection!.sendRequest({}, 'get_config');
  return res as PlayerConfig;
};
