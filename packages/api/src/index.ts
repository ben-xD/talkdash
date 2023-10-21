import { initContract } from '@ts-rest/core';
import { z } from 'zod';

const c = initContract();

const messageSchema = z.object({
  id: z.string(),
  message: z.string(),
  from: z.string(),
});

export const contract = c.router({
  sendMessageToSpeaker: {
    method: 'PUT',
    path: '/speakers/:speakerId/messages',
    responses: {
      201: z.undefined(),
    },
    body: messageSchema.omit({from: true}),
    summary: 'Send a speaker a message.',
  },
  getSpeakerMessages: {
    method: 'GET',
    path: `/speakers/:speakerId/messages`,
    responses: {
      200: messageSchema.array(),
    },
    summary: 'Get all messages for a speaker.',
  },
});