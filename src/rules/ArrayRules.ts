import { BaseRule } from '../core/BaseRule.js';
import type { RuleResult } from '../core/types.js';

export class MinItemsRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は{min}件以上選択してください';

  constructor(private min: number) {
    super();
    this.message = MinItemsRule.DEFAULT_MSG;
  }

  static setDefaultMessage(template: string): void {
    MinItemsRule.DEFAULT_MSG = template;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (!Array.isArray(value)) return { ok: true };
    if (value.length < this.min) {
      return { ok: false, message: this.buildMessage(label, attr, { min: this.min }) };
    }
    return { ok: true };
  }
}

export class MaxItemsRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は{max}件以内で選択してください';

  constructor(private max: number) {
    super();
    this.message = MaxItemsRule.DEFAULT_MSG;
  }

  static setDefaultMessage(template: string): void {
    MaxItemsRule.DEFAULT_MSG = template;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (!Array.isArray(value)) return { ok: true };
    if (value.length > this.max) {
      return { ok: false, message: this.buildMessage(label, attr, { max: this.max }) };
    }
    return { ok: true };
  }
}

export class UniqueRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}の要素は重複できません';

  constructor() {
    super();
    this.message = UniqueRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (!Array.isArray(value)) return { ok: true };
    const set = new Set(value.map((v) => JSON.stringify(v)));
    if (set.size !== value.length) {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
    return { ok: true };
  }
}
