import {contract} from 'api';
import {initClient} from "@ts-rest/core";

export const backendUrl = import.meta.env.BACKEND_URL || "/";

export const client = initClient(contract, {
  baseUrl: backendUrl,
  baseHeaders: {}
})
