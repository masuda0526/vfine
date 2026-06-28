import { BaseValidator } from '../core/BaseValidator.js';
import type { ValidationResult } from '../core/types.js';
import {
  MinRule,
  MaxRule,
  IntegerRule,
  PositiveRule,
  NegativeRule,
  MultipleOfRule,
  DigitsRule,
  DecimalDigitsRule,
} from '../rules/NumberRules.js';

export class NumberValidator extends BaseValidator {
  private _typeError = false;

  protected coerce(value: unknown): unknown {
    this._typeError = false;
    if (typeof value === 'number') return value;
    if (value === null || value === undefined || value === '') return value;
    if (typeof value === 'string') {
      const n = Number(value);
      if (!isNaN(n)) return n;
      this._typeError = true;
      return value;
    }
    return value;
  }

  protected isEmpty(value: unknown): boolean {
    return value === null || value === undefined || value === '';
  }

  validate(requiredOnly?: boolean): ValidationResult {
    const coerced = this.coerce(this.value);
    if (this._typeError) {
      return {
        attr: this.attr,
        label: this.label,
        ok: false,
        errors: [`${this.label}は数値で入力してください`],
      };
    }
    return super.validate(requiredOnly);
  }

  min(threshold: number, msg?: string): this {
    const rule = new MinRule(threshold);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  max(threshold: number, msg?: string): this {
    const rule = new MaxRule(threshold);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  integer(msg?: string): this {
    const rule = new IntegerRule();
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  positive(msg?: string): this {
    const rule = new PositiveRule();
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  negative(msg?: string): this {
    const rule = new NegativeRule();
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  multipleOf(n: number, msg?: string): this {
    const rule = new MultipleOfRule(n);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  digits(n: number, msg?: string): this {
    const rule = new DigitsRule(n);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  decimalDigits(n: number, msg?: string): this {
    const rule = new DecimalDigitsRule(n);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  protected applyRuleString(ruleName: string, arg?: string): void {
    switch (ruleName) {
      case 'min':
        if (arg !== undefined) this.min(Number(arg));
        break;
      case 'max':
        if (arg !== undefined) this.max(Number(arg));
        break;
      case 'integer':
        this.integer();
        break;
      case 'positive':
        this.positive();
        break;
      case 'negative':
        this.negative();
        break;
      case 'multipleOf':
        if (arg !== undefined) this.multipleOf(Number(arg));
        break;
      default:
        super.applyRuleString(ruleName, arg);
    }
  }
}
