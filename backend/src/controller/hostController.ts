import { CONSTANTS } from "../config/server";
import { getHostByGroupId, getHostFilter } from "../service/fetch/requestHost";
import { client } from "./mainController";

async function loadGroupHost(message: string | number) {
  const data = typeof message === 'number' ? await getHostByGroupId({ id: message }) : await getHostFilter({ name: message }) 

  const formatMessage: String[] = [];

  data.result.map((value) => {
    formatMessage.push(`${value.hostid}: ${value.host}`)
  });

  const formartMsg = String(formatMessage).replace('/,/g', '');
  client.sendMessage(`${CONSTANTS.ID_WS_GROUP}`, formartMsg);
}

export { loadGroupHost };