import { v4 as uuidv4 } from 'uuid';
import type { Middleware } from 'redux';

type NeedUuid = {
    type: string,
    payload: Record<string, unknown>,
    needUuid: string,
}

function isNeedUuid(action: unknown): action is NeedUuid {
    return !!action 
        && typeof action === 'object'
        && 'needUuid' in action 
        && 'payload' in action 
        && typeof action.payload === 'object'
} 

const generateUuidMiddleware: Middleware = (_) => (next) => (action) => {
    if (isNeedUuid(action)) {
        return next({
            type: action.type,
            payload: {
                ...action.payload,
                id: uuidv4(),
            },
        })
    }
    return next(action);
}

export {
    generateUuidMiddleware
}