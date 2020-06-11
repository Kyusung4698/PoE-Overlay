import { Injectable } from '@angular/core';
import { ProcessStorageService } from '@app/storage';
import { TradeRateLimit } from '../service/trade-rate-limit';

interface TradeRateLimits {
    [resource: string]: TradeRateLimit;
}

const RATE_LIMITS_DATA_KEY = 'RATE_LIMITS_DATA';

@Injectable({
    providedIn: 'root'
})
export class TradeRateLimitProvider {
    constructor(private readonly storage: ProcessStorageService) { }

    public provide(resource: string): TradeRateLimit {
        if (!this.limits[resource]) {
            this.limits[resource] = {
                requests: [],
                rules: undefined,
                update: undefined
            };
        }
        return this.limits[resource];
    }

    private get limits(): TradeRateLimits {
        return this.storage.get(RATE_LIMITS_DATA_KEY, () => ({}));
    }
}
