import { BaseValidator } from '../core/BaseValidator.js';
import type { ValidationResult } from '../core/types.js';
import { DateMinRule, DateMaxRule, PastRule, FutureRule, DateFormatRule } from '../rules/DateRules.js';
import { RequiredRule } from '../rules/CommonRules.js';

export class DateValidator extends BaseValidator {
  protected coerce(value: unknown): unknown {
    if (value instanceof Date) return value;
    if (value === null || value === undefined || value === '') return value;
    if (typeof value === 'string') {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d;
      return undefined;
    }
    return value;
  }

  protected isEmpty(value: unknown): boolean {
    return value === null || value === undefined || value === '';
  }

  min(date: Date | string, msg?: string): this {
    const rule = new DateMinRule(date);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  max(date: Date | string, msg?: string): this {
    const rule = new DateMaxRule(date);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  past(msg?: string): this {
    const rule = new PastRule();
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  future(msg?: string): this {
    const rule = new FutureRule();
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  format(fmt: string, msg?: string): this {
    const rule = new DateFormatRule(fmt);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  validate(requiredOnly?: boolean): ValidationResult {
    const errors: string[] = [];

    // format rules must run on original string before coercion
    if (!requiredOnly && typeof this.value === 'string' && this.value !== '') {
      for (const rule of this.rules) {
        if (rule instanceof DateFormatRule) {
          const r = rule.validate(this.value, this.label, this.attr);
          if (!r.ok && r.message) errors.push(r.message);
        }
      }
      if (errors.length > 0) {
        return { attr: this.attr, label: this.label, ok: false, errors };
      }
    }

    return super.validate(requiredOnly);
  }

  protected applyRuleString(ruleName: string, arg?: string): void {
    switch (ruleName) {
      case 'past':
        this.past();
        break;
      case 'future':
        this.future();
        break;
      default:
        super.applyRuleString(ruleName, arg);
    }
  }
}
