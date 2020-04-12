import * as fs from 'fs';
import * as path from 'path';

const ANIMATION_FILE = 'animation.flag'
const VERSION_FILE = 'version.txt'

const FLAG_FILE_VALUE = 'true';

export class State {
    private readonly animationPath: string;
    private readonly versionPath: string;

    constructor(private readonly userDataPath: string) {
        this.animationPath = path.join(this.userDataPath, ANIMATION_FILE);
        this.versionPath = path.join(this.userDataPath, VERSION_FILE);
    }

    public get hardwareAcceleration(): boolean {
        const animationExists = fs.existsSync(this.animationPath);
        return !animationExists;
    }

    public set hardwareAcceleration(enable: boolean) {
        if (!enable) {
            fs.writeFileSync(this.animationPath, FLAG_FILE_VALUE);
        } else {
            fs.unlinkSync(this.animationPath);
        }
    }

    public isVersionUpdated(appVersion: string): boolean {
        let versionUpdated = true;
        const versionExists = fs.existsSync(this.versionPath);
        if (versionExists) {
            const version = fs.readFileSync(this.versionPath, 'utf-8').trim();
            versionUpdated = version !== appVersion;
            console.info(`App checking version: ${version} -> ${appVersion}, ${versionUpdated}`);
        }
        if (versionUpdated) {
            fs.writeFileSync(this.versionPath, appVersion)
        }
        return versionUpdated;
    }
}