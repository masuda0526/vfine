import { BaseRule } from '../core/BaseRule.js';
import type { RuleResult } from '../core/types.js';

export class RequiredRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は必須項目です';

  constructor() {
    super();
    this.message = RequiredRule.DEFAULT_MSG;
  }

  static setDefaultMessage(template: string): void {
    RequiredRule.DEFAULT_MSG = template;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    const isEmpty =
      value === null ||
      value === undefined ||
      value === '';
    if (isEmpty) {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
    return { ok: true };
  }
}

export class CustomRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}の値が不正です';

  constructor(private fn: (value: unknown) => boolean | string) {
    super();
    this.message = CustomRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    const result = this.fn(value);
    if (result === true) return { ok: true };
    if (result === false) {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
    return { ok: false, message: result as string };
  }
}
