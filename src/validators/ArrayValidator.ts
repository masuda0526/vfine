import { BaseValidator } from '../core/BaseValidator.js';
import { MinItemsRule, MaxItemsRule, UniqueRule } from '../rules/ArrayRules.js';
import type { ValidationResult } from '../core/types.js';
import { RequiredRule } from '../rules/CommonRules.js';

export class ArrayValidator extends BaseValidator {
  private _itemsValidator?: BaseValidator;

  protected coerce(value: unknown): unknown {
    return value;
  }

  protected isEmpty(value: unknown): boolean {
    return value === null || value === undefined;
  }

  minItems(n: number, msg?: string): this {
    const rule = new MinItemsRule(n);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  maxItems(n: number, msg?: string): this {
    const rule = new MaxItemsRule(n);
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  items(validator: BaseValidator): this {
    this._itemsValidator = validator;
    return this;
  }

  unique(msg?: string): this {
    const rule = new UniqueRule();
    if (msg) rule.setMessage(msg);
    this.rules.push(rule);
    return this;
  }

  validate(requiredOnly?: boolean): ValidationResult {
    const result = super.validate(requiredOnly);
    if (!result.ok || !this._itemsValidator || !Array.isArray(this.value)) {
      return result;
    }

    const itemErrors: string[] = [];
    const arr = this.value as unknown[];
    for (let i = 0; i < arr.length; i++) {
      const v = this._itemsValidator;
      (v as unknown as { value: unknown }).value = arr[i];
      const itemResult = v.validate(requiredOnly);
      if (!itemResult.ok) {
        itemErrors.push(...itemResult.errors.map((e) => `[${i}] ${e}`));
      }
    }

    if (itemErrors.length > 0) {
      return { ...result, ok: false, errors: [...result.errors, ...itemErrors] };
    }

    return result;
  }

  protected applyRuleString(ruleName: string, arg?: string): void {
    switch (ruleName) {
      case 'minItems':
        if (arg !== undefined) this.minItems(Number(arg));
        break;
      case 'maxItems':
        if (arg !== undefined) this.maxItems(Number(arg));
        break;
      case 'unique':
        this.unique();
        break;
      default:
        super.applyRuleString(ruleName, arg);
    }
  }
}
