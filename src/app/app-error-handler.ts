import { ErrorHandler, Injectable } from '@angular/core';
import * as StackTrace from 'stacktrace-js';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
    public handleError(error: any): void {
        StackTrace.fromError(error).then(stackframes => {
            const message = error.message ?? error;
            const stack = stackframes.splice(0, 20).map(x => x.toString()).join('\n');
            console.error(`An unexpected application error occured. ${JSON.stringify({ message, stack })}`);
        });
        throw error;
    }
}
