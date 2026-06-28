import { BaseValidator } from '../core/BaseValidator.js';
import { IsTrueRule, IsFalseRule } from '../rules/BooleanRules.js';

const TRUE_VALUES = new Set(['true', '1', 'yes', 'on']);
const FALSE_VALUES = new Set(['false', '0', 'no', 'off']);

export class BooleanValidator extends BaseValidator {
  protected coerce(value: unknown): unknown {
    if (typeof value === 'boolean') return value;
    if (value === null || value === undefined) return value;
    if (typeof value === 'string') {
      const lower = value.toLowerCase();
      if (TRUE_VALUES.has(lower)) return true;
      if (FALSE_VALUES.has(lower)) return false;
      return undefined;
    }
    return value;
  }

  protected isEmpty(value: unknown): boolean {
    return value === null || value === undefined;
  }

  isTrue(msg?: string): this {
    const rule = new IsTrueRule();
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  isFalse(msg?: string): this {
    const rule = new IsFalseRule();
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }
}
