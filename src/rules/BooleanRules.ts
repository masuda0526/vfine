import { BaseRule } from '../core/BaseRule.js';
import type { RuleResult } from '../core/types.js';

export class IsTrueRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}はtrueである必要があります';

  constructor() {
    super();
    this.message = IsTrueRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (value !== true) {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
    return { ok: true };
  }
}

export class IsFalseRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}はfalseである必要があります';

  constructor() {
    super();
    this.message = IsFalseRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (value !== false) {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
    return { ok: true };
  }
}
