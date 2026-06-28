import { BaseRule } from '../core/BaseRule.js';
import type { RuleResult } from '../core/types.js';

export class MinLengthRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は{min}文字以上で入力してください';

  constructor(private min: number) {
    super();
    this.message = MinLengthRule.DEFAULT_MSG;
  }

  static setDefaultMessage(template: string): void {
    MinLengthRule.DEFAULT_MSG = template;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'string') return { ok: true };
    if (value.length < this.min) {
      return { ok: false, message: this.buildMessage(label, attr, { min: this.min }) };
    }
    return { ok: true };
  }
}

export class MaxLengthRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は{max}文字以内で入力してください';

  constructor(private max: number) {
    super();
    this.message = MaxLengthRule.DEFAULT_MSG;
  }

  static setDefaultMessage(template: string): void {
    MaxLengthRule.DEFAULT_MSG = template;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'string') return { ok: true };
    if (value.length > this.max) {
      return { ok: false, message: this.buildMessage(label, attr, { max: this.max }) };
    }
    return { ok: true };
  }
}

export class LengthRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は{length}文字で入力してください';

  constructor(private length: number) {
    super();
    this.message = LengthRule.DEFAULT_MSG;
  }

  static setDefaultMessage(template: string): void {
    LengthRule.DEFAULT_MSG = template;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'string') return { ok: true };
    if (value.length !== this.length) {
      return { ok: false, message: this.buildMessage(label, attr, { length: this.length }) };
    }
    return { ok: true };
  }
}

export class PatternRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}の形式が正しくありません';

  constructor(private pattern: RegExp) {
    super();
    this.message = PatternRule.DEFAULT_MSG;
  }

  static setDefaultMessage(template: string): void {
    PatternRule.DEFAULT_MSG = template;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'string') return { ok: true };
    if (!this.pattern.test(value)) {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
    return { ok: true };
  }
}

export class EmailRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は正しいメールアドレス形式で入力してください';
  private static EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor() {
    super();
    this.message = EmailRule.DEFAULT_MSG;
  }

  static setDefaultMessage(template: string): void {
    EmailRule.DEFAULT_MSG = template;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'string') return { ok: true };
    if (!EmailRule.EMAIL_REGEX.test(value)) {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
    return { ok: true };
  }
}

export class UrlRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は正しいURL形式で入力してください';

  constructor() {
    super();
    this.message = UrlRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'string') return { ok: true };
    try {
      new URL(value);
      return { ok: true };
    } catch {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
  }
}

export class UuidRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}はUUID形式で入力してください';
  private static UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  constructor() {
    super();
    this.message = UuidRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'string') return { ok: true };
    if (!UuidRule.UUID_REGEX.test(value)) {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
    return { ok: true };
  }
}

export class NumericRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は数字のみで入力してください';

  constructor() {
    super();
    this.message = NumericRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'string') return { ok: true };
    if (!/^\d+$/.test(value)) {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
    return { ok: true };
  }
}

export class AlphanumericRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は英数字のみで入力してください';

  constructor() {
    super();
    this.message = AlphanumericRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'string') return { ok: true };
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      return { ok: false, message: this.buildMessage(label, attr) };
    }
    return { ok: true };
  }
}

export class IncludesRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}に"{includes}"を含めてください';

  constructor(private str: string) {
    super();
    this.message = IncludesRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'string') return { ok: true };
    if (!value.includes(this.str)) {
      return { ok: false, message: this.buildMessage(label, attr, { includes: this.str }) };
    }
    return { ok: true };
  }
}

export class StartsWithRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は"{startsWith}"で始まる必要があります';

  constructor(private str: string) {
    super();
    this.message = StartsWithRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'string') return { ok: true };
    if (!value.startsWith(this.str)) {
      return { ok: false, message: this.buildMessage(label, attr, { startsWith: this.str }) };
    }
    return { ok: true };
  }
}

export class EndsWithRule extends BaseRule {
  protected static DEFAULT_MSG = '{label}は"{endsWith}"で終わる必要があります';

  constructor(private str: string) {
    super();
    this.message = EndsWithRule.DEFAULT_MSG;
  }

  validate(value: unknown, label: string, attr: string): RuleResult {
    if (typeof value !== 'string') return { ok: true };
    if (!value.endsWith(this.str)) {
      return { ok: false, message: this.buildMessage(label, attr, { endsWith: this.str }) };
    }
    return { ok: true };
  }
}
