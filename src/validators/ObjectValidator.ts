import { BaseValidator } from '../core/BaseValidator.js';
import type { ValidationResult } from '../core/types.js';

export class ObjectValidator extends BaseValidator {
  private _shape?: Record<string, BaseValidator>;
  private _strict = false;

  protected coerce(value: unknown): unknown {
    return value;
  }

  protected isEmpty(value: unknown): boolean {
    return value === null || value === undefined;
  }

  shape(schemaMap: Record<string, BaseValidator>): this {
    this._shape = schemaMap;
    return this;
  }

  strict(msg?: string): this {
    this._strict = true;
    return this;
  }

  validate(requiredOnly?: boolean): ValidationResult {
    const result = super.validate(requiredOnly);
    if (!result.ok) return result;
    if (!this._shape || typeof this.value !== 'object' || this.value === null) {
      return result;
    }

    const errors: string[] = [...result.errors];
    const obj = this.value as Record<string, unknown>;

    if (this._strict) {
      const extraKeys = Object.keys(obj).filter((k) => !this._shape![k]);
      for (const key of extraKeys) {
        errors.push(`未定義のプロパティ "${key}" は許可されていません`);
      }
    }

    for (const [key, validator] of Object.entries(this._shape)) {
      (validator as unknown as { value: unknown }).value = obj[key];
      const fieldResult = validator.validate(requiredOnly);
      if (!fieldResult.ok) {
        errors.push(...fieldResult.errors.map((e) => `${key}: ${e}`));
      }
    }

    return { ...result, ok: errors.length === 0, errors };
  }
}
