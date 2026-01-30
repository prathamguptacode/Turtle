import type { Request, Response } from 'express';
import sessionId from '../model/sessionId.js';
import {
    InputGuardrailTripwireTriggered,
    OpenAIConversationsSession,
    run,
} from '@openai/agents';
import type { userT } from '../types/userInfoAlgo.js';
import chatbox from '../algorithms/agents/chatbox.js';

export async function chat(req: Request, res: Response) {
    const userId = req.user;
    const input = req.body?.input;
    if (!input) {
        return res.status(400).json({ message: 'input not provided' });
    }
    let coversationId = '';
    if (req.cookies.chatToken) {
        const sessionDbId = req.cookies.chatToken;
        const sessionData = await sessionId.findById(sessionDbId);
        if (!sessionData) {
            return res.status(500).json({ message: 'session data not found' });
        }
        coversationId = sessionData.sessionId;
    }
    if (!req.cookies.chatToken) {
        const session = new OpenAIConversationsSession();
        const convId = await session.getSessionId();
        if (!convId) {
            return res
                .status(500)
                .json({ message: 'something went wrong while making conv' });
        }
        const sessionDb = new sessionId({
            owner: userId,
            sessionId: convId,
        });
        await sessionDb.save();
        res.cookie('chatToken', sessionDb._id, { maxAge: 86400 * 1000 });
        coversationId = convId;
    }
    const userSession = new OpenAIConversationsSession({
        conversationId: coversationId,
    });
    const userInfo: userT = {
        id: userId.toString(),
    };
    try {
        const result = await run(chatbox, input, {
            context: userInfo,
            session: userSession,
        });
        res.json({ message: result.finalOutput });
    } catch (error) {
        if (error instanceof InputGuardrailTripwireTriggered) {
            return res.json({ message: error.result.output.outputInfo, tripErr: true });
        }
        console.log(error);
        return res.status(500).json({message:'Something went wrong with agent'})
    }
}
