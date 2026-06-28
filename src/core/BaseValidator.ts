import type { ValidationResult } from './types.js';
import { BaseRule } from './BaseRule.js';
import { RequiredRule, CustomRule } from '../rules/CommonRules.js';

export abstract class BaseValidator {
  protected attr: string;
  protected label: string;
  protected value: unknown;
  protected rules: BaseRule[] = [];

  constructor(attr: string, label: string, value: unknown) {
    this.attr = attr;
    this.label = label;
    this.value = value;
  }

  required(msg?: string): this {
    const rule = new RequiredRule();
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  custom(fn: (value: unknown) => boolean | string, msg?: string): this {
    const rule = new CustomRule(fn);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  setMessage(template: string): this {
    if (this.rules.length > 0) {
      this.rules[this.rules.length - 1].setMessage(template);
    }
    return this;
  }

  rule(ruleString: string): this {
    const parts = ruleString.split('|');
    for (const part of parts) {
      const [ruleWithArgs] = part.split(',');
      const colonIdx = ruleWithArgs.indexOf(':');
      const ruleName = colonIdx === -1 ? ruleWithArgs : ruleWithArgs.slice(0, colonIdx);
      const ruleArg = colonIdx === -1 ? undefined : ruleWithArgs.slice(colonIdx + 1);
      this.applyRuleString(ruleName.trim(), ruleArg?.trim());
    }
    return this;
  }

  protected applyRuleString(ruleName: string, arg?: string): void {
    switch (ruleName) {
      case 'required':
        this.required();
        break;
      default:
        break;
    }
  }

  protected isEmpty(value: unknown): boolean {
    return value === null || value === undefined || value === '';
  }

  protected coerce(value: unknown): unknown {
    return value;
  }

  validate(requiredOnly?: boolean): ValidationResult {
    const coerced = this.coerce(this.value);
    const empty = this.isEmpty(coerced);
    const hasRequired = this.rules.some((r) => r instanceof RequiredRule);
    const errors: string[] = [];

    if (empty) {
      if (hasRequired) {
        const rule = this.rules.find((r) => r instanceof RequiredRule)!;
        const result = rule.validate(coerced, this.label, this.attr);
        if (!result.ok && result.message) errors.push(result.message);
      }
      return { attr: this.attr, label: this.label, ok: errors.length === 0, errors };
    }

    const rulesToRun = requiredOnly
      ? this.rules.filter((r) => r instanceof RequiredRule)
      : this.rules;

    for (const rule of rulesToRun) {
      const result = rule.validate(coerced, this.label, this.attr);
      if (!result.ok && result.message) {
        errors.push(result.message);
      }
    }

    return { attr: this.attr, label: this.label, ok: errors.length === 0, errors };
  }
}
