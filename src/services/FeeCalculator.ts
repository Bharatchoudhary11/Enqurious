import { FeePolicy } from '../domain/types.js';

// Default policy: Round up to next hour.
// First hour: $10, each additional hour: $5.
export class DefaultFeePolicy implements FeePolicy {
  name = 'default-v1';

  calculate(entry: Date, exit: Date): number {
    if (exit <= entry) return 0;
    const ms = exit.getTime() - entry.getTime();
    const hours = Math.ceil(ms / (1000 * 60 * 60));
    if (hours <= 1) return 10;
    return 10 + (hours - 1) * 5;
  }
}

// Configurable policy with base and incremental rates.
export class ConfigurableFeePolicy implements FeePolicy {
  name: string;
  private baseHours: number;
  private baseFee: number;
  private perHourAfterBase: number;

  constructor(opts: { name?: string; baseHours: number; baseFee: number; perHourAfterBase: number }) {
    this.name = opts.name ?? 'configurable';
    this.baseHours = opts.baseHours;
    this.baseFee = opts.baseFee;
    this.perHourAfterBase = opts.perHourAfterBase;
  }

  calculate(entry: Date, exit: Date): number {
    if (exit <= entry) return 0;
    const ms = exit.getTime() - entry.getTime();
    const hours = Math.ceil(ms / (1000 * 60 * 60));
    if (hours <= this.baseHours) return this.baseFee;
    return this.baseFee + (hours - this.baseHours) * this.perHourAfterBase;
  }
}

