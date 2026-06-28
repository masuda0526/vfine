import { BaseRule } from '../core/BaseRule.js';
import type { RuleResult } from '../core/types.js';

export class MinRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は{min}以上で入力してください';

  constructor(private min: number) {
    super();
    this.message = MinRule.DEFAULT_MSG;
  }

  static setDefaultMessage(template: string): void {
    MinRule.DEFAULT_MSG = template;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'number') return { ok: true };
    if (value < this.min) {
      return { ok: false, message: this.buildMessage(label, attr, { min: this.min }) };
    }
    return { ok: true };
  }
}

export class MaxRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は{max}以下で入力してください';

  constructor(private max: number) {
    super();
    this.message = MaxRule.DEFAULT_MSG;
  }

  static setDefaultMessage(template: string): void {
    MaxRule.DEFAULT_MSG = template;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'number') return { ok: true };
    if (value > this.max) {
      return { ok: false, message: this.buildMessage(label, attr, { max: this.max }) };
    }
    return { ok: true };
  }
}

export class IntegerRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は整数で入力してください';

  constructor() {
    super();
    this.message = IntegerRule.DEFAULT_MSG;
  }

  static setDefaultMessage(template: string): void {
    IntegerRule.DEFAULT_MSG = template;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'number') return { ok: true };
    if (!Number.isInteger(value)) {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
    return { ok: true };
  }
}

export class PositiveRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は正の数で入力してください';

  constructor() {
    super();
    this.message = PositiveRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'number') return { ok: true };
    if (value <= 0) {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
    return { ok: true };
  }
}

export class NegativeRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は負の数で入力してください';

  constructor() {
    super();
    this.message = NegativeRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'number') return { ok: true };
    if (value >= 0) {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
    return { ok: true };
  }
}

export class MultipleOfRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は{multipleOf}の倍数で入力してください';

  constructor(private multipleOf: number) {
    super();
    this.message = MultipleOfRule.DEFAULT_MSG;
  }

  static setDefaultMessage(template: string): void {
    MultipleOfRule.DEFAULT_MSG = template;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'number') return { ok: true };
    if (value % this.multipleOf !== 0) {
      return { ok: false, message: this.buildMessage(label, attr, { multipleOf: this.multipleOf }) };
    }
    return { ok: true };
  }
}

export class DigitsRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は整数部{digits}桁以内で入力してください';

  constructor(private digits: number) {
    super();
    this.message = DigitsRule.DEFAULT_MSG;
  }

  static setDefaultMessage(template: string): void {
    DigitsRule.DEFAULT_MSG = template;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'number') return { ok: true };
    const intPart = Math.trunc(Math.abs(value)).toString();
    if (intPart.length > this.digits) {
      return { ok: false, message: this.buildMessage(label, attr, { digits: this.digits }) };
    }
    return { ok: true };
  }
}

export class DecimalDigitsRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は小数部{decimalDigits}桁以内で入力してください';

  constructor(private decimalDigits: number) {
    super();
    this.message = DecimalDigitsRule.DEFAULT_MSG;
  }

  static setDefaultMessage(template: string): void {
    DecimalDigitsRule.DEFAULT_MSG = template;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'number') return { ok: true };
    const str = value.toString();
    const dotIndex = str.indexOf('.');
    const decLen = dotIndex === -1 ? 0 : str.length - dotIndex - 1;
    if (decLen > this.decimalDigits) {
      return { ok: false, message: this.buildMessage(label, attr, { decimalDigits: this.decimalDigits }) };
    }
    return { ok: true };
  }
}
