import { BaseRule } from '../core/BaseRule.js';
import type { RuleResult } from '../core/types.js';

export class DateMinRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は{min}以降の日付で入力してください';
  private minDate: Date;

  constructor(date: Date | string) {
    super();
    this.message = DateMinRule.DEFAULT_MSG;
    this.minDate = date instanceof Date ? date : new Date(date);
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (!(value instanceof Date)) return { ok: true };
    if (value < this.minDate) {
      return { ok: false, message: this.buildMessage(label, attr, { min: this.minDate.toISOString().slice(0, 10) }) };
    }
    return { ok: true };
  }
}

export class DateMaxRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は{max}以前の日付で入力してください';
  private maxDate: Date;

  constructor(date: Date | string) {
    super();
    this.message = DateMaxRule.DEFAULT_MSG;
    this.maxDate = date instanceof Date ? date : new Date(date);
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (!(value instanceof Date)) return { ok: true };
    if (value > this.maxDate) {
      return { ok: false, message: this.buildMessage(label, attr, { max: this.maxDate.toISOString().slice(0, 10) }) };
    }
    return { ok: true };
  }
}

export class PastRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は過去の日付で入力してください';

  constructor() {
    super();
    this.message = PastRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (!(value instanceof Date)) return { ok: true };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (value >= today) {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
    return { ok: true };
  }
}

export class FutureRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は未来の日付で入力してください';

  constructor() {
    super();
    this.message = FutureRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (!(value instanceof Date)) return { ok: true };
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    if (value <= today) {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
    return { ok: true };
  }
}

export class DateFormatRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は{format}形式で入力してください';

  constructor(private fmt: string) {
    super();
    this.message = DateFormatRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'string') return { ok: true };
    const regex = this.fmtToRegex(this.fmt);
    if (!regex.test(value)) {
      return { ok: false, message: this.buildMessage(label, attr, { format: this.fmt }) };
    }
    return { ok: true };
  }

  private fmtToRegex(fmt: string): RegExp {
    const pattern = fmt
      .replace(/YYYY/g, '\\d{4}')
      .replace(/MM/g, '\\d{2}')
      .replace(/DD/g, '\\d{2}')
      .replace(/HH/g, '\\d{2}')
      .replace(/mm/g, '\\d{2}')
      .replace(/ss/g, '\\d{2}');
    return new RegExp(`^${pattern}$`);
  }
}
