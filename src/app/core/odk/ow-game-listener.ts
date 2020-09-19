import { RunningGameInfo } from './ow-types';

export interface OWGameListenerDelegate {
    onGameStarted?(info: RunningGameInfo): void;
    onGameEnded?(info: RunningGameInfo): void;
    onGameResolutionChanged?(info: RunningGameInfo): void;
}

export class OWGameListener {
    constructor(private readonly delegate: OWGameListenerDelegate) { }

    public start(): void {
        overwolf.games.onGameInfoUpdated.addListener(this.onGameInfoUpdated);
        overwolf.games.getRunningGameInfo(this.onRunningGameInfo);
    }

    public stop(): void {
        overwolf.games.onGameInfoUpdated.removeListener(this.onGameInfoUpdated);
    }

    private onGameInfoUpdated = (update: overwolf.games.GameInfoUpdatedEvent): void => {
        if (!update?.gameInfo) {
            return;
        }

        if (update.resolutionChanged) {
            if (this.delegate.onGameResolutionChanged) {
                this.delegate.onGameResolutionChanged({...update.gameInfo});
            }
        }

        if (!update.runningChanged && !update.gameChanged) {
            return;
        }

        if (update.gameInfo.isRunning) {
            if (this.delegate.onGameStarted) {
                this.delegate.onGameStarted({...update.gameInfo});
            }
        } else {
            if (this.delegate.onGameEnded) {
                this.delegate.onGameEnded({...update.gameInfo});
            }
        }
    }

    private onRunningGameInfo = (info: overwolf.games.RunningGameInfo): void => {
        if (!info) {
            return;
        }

        if (info.isRunning) {
            if (this.delegate.onGameStarted) {
                this.delegate.onGameStarted({...info});
            }
        }
    }
}
