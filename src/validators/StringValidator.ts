import { BaseValidator } from '../core/BaseValidator.js';
import {
  MinLengthRule,
  MaxLengthRule,
  LengthRule,
  PatternRule,
  EmailRule,
  UrlRule,
  UuidRule,
  NumericRule,
  AlphanumericRule,
  IncludesRule,
  StartsWithRule,
  EndsWithRule,
} from '../rules/StringRules.js';

export class StringValidator extends BaseValidator {
  private _trim = false;

  protected coerce(value: unknown): unknown {
    if (typeof value === 'string') {
      return this._trim ? value.trim() : value;
    }
    return value;
  }

  protected isEmpty(value: unknown): boolean {
    return value === null || value === undefined || value === '';
  }

  trim(): this {
    this._trim = true;
    return this;
  }

  minLength(n: number, msg?: string): this {
    const rule = new MinLengthRule(n);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  maxLength(n: number, msg?: string): this {
    const rule = new MaxLengthRule(n);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  length(n: number, msg?: string): this {
    const rule = new LengthRule(n);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  pattern(regex: RegExp, msg?: string): this {
    const rule = new PatternRule(regex);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  email(msg?: string): this {
    const rule = new EmailRule();
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  url(msg?: string): this {
    const rule = new UrlRule();
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  uuid(msg?: string): this {
    const rule = new UuidRule();
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  numeric(msg?: string): this {
    const rule = new NumericRule();
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  alphanumeric(msg?: string): this {
    const rule = new AlphanumericRule();
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  includes(str: string, msg?: string): this {
    const rule = new IncludesRule(str);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  startsWith(str: string, msg?: string): this {
    const rule = new StartsWithRule(str);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  endsWith(str: string, msg?: string): this {
    const rule = new EndsWithRule(str);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  protected applyRuleString(ruleName: string, arg?: string): void {
    switch (ruleName) {
      case 'minLength':
        if (arg !== undefined) this.minLength(Number(arg));
        break;
      case 'maxLength':
        if (arg !== undefined) this.maxLength(Number(arg));
        break;
      case 'length':
        if (arg !== undefined) this.length(Number(arg));
        break;
      case 'email':
        this.email();
        break;
      case 'url':
        this.url();
        break;
      case 'uuid':
        this.uuid();
        break;
      case 'numeric':
        this.numeric();
        break;
      case 'alphanumeric':
        this.alphanumeric();
        break;
      case 'pattern':
        if (arg !== undefined) this.pattern(new RegExp(arg));
        break;
      default:
        super.applyRuleString(ruleName, arg);
    }
  }
}
