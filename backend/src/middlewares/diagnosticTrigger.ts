import { CONSTANTS } from "../config/server";
import { getGraphInfo } from "../controller/graph/graphController";
import { sendMensageTrigger } from "../controller/message/messageController";
import { priorityIncidente } from "../utils/priorityIncident";

import { getNewTrigger } from "../service/fetch/requestTriggers";
import { ParamsLoadDiagnostic, ParamsSendMessage } from "../types/theadNewMessage/ParamsThread";
import { converterTimestamp, TIMESTAMPNOW } from "../utils";

function loadDiagnostic({ coment, data, host, index }: ParamsLoadDiagnostic) {
  const PARAMS = {
    lastchange: data?.result?.[index]?.lastchange,
    priority: data?.result?.[index]?.priority,
    triggerid: data?.result?.[index]?.triggerid,
    eventid: data?.result?.[index]?.lastEvent.eventid,
    description: data?.result?.[index]?.description,
  }

  const timeIncidet = converterTimestamp(PARAMS.lastchange);
  const priority = priorityIncidente(parseInt(PARAMS.priority));

  const diagnostic = `Novo incidente encontrado: ${PARAMS.triggerid}`
    + '\n' + `Descrição: *${PARAMS.description}*`
    + '\n' + `Horario: ${timeIncidet}`
    + '\n' + `Prioridade: ${priority}`
    + '\n' + `Comentários: ${coment}`
    + '\n' + `Host: *${host}*`
    + '\n\n' + `http://sede.vidatel.com.br/tr_events.php?triggerid=${PARAMS.triggerid}&eventid=${PARAMS.eventid}`;

  return diagnostic;
}

async function sendMessagemTrigger({ diagnostic, hostid, type }: ParamsSendMessage) {
  if (type.toLowerCase() === "baixa voltagem" || type.toLowerCase() === "alta voltagem") {
    await getGraphInfo({
      hostId: hostid,
      from: '1h',
      message: diagnostic,
      groupId: `${CONSTANTS.ID_WS_GROUP}`
    });

    console.log("Mensagem enviada ao whatsapp às: ", TIMESTAMPNOW());
  }

  else {
    await sendMensageTrigger(`${CONSTANTS.ID_WS_GROUP}`, diagnostic);
    
    console.log("Mensagem enviada ao whatsapp às: ", TIMESTAMPNOW());
  }
}

async function threadNewMessage() {
  const timestampNow = TIMESTAMPNOW();

  const data = await getNewTrigger(timestampNow);

  const lengthTrigger = data.result?.length;

  if (lengthTrigger > 0) {
    data.result?.map(async (value, index: number) => {
      const typeTrigger = data?.result?.[index]?.description;
      const diagnostic = loadDiagnostic({ data, coment: value?.comments, host: value?.hosts?.[0]?.name, index });

      await sendMessagemTrigger({ diagnostic, hostid: Number(value?.hosts?.[0]?.hostid), type: typeTrigger })
    });
  }
}

export { threadNewMessage }