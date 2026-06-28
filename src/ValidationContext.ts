import type { ValidationResult } from './core/types.js';
import { BaseValidator } from './core/BaseValidator.js';
import { StringValidator } from './validators/StringValidator.js';
import { NumberValidator } from './validators/NumberValidator.js';
import { BooleanValidator } from './validators/BooleanValidator.js';
import { DateValidator } from './validators/DateValidator.js';
import { ArrayValidator } from './validators/ArrayValidator.js';
import { ObjectValidator } from './validators/ObjectValidator.js';

export class ValidationContext {
  private validators: BaseValidator[] = [];

  addString(attr: string, label: string, value: unknown): StringValidator {
    const v = new StringValidator(attr, label, value);
    this.validators.push(v);
    return v;
  }

  addNumber(attr: string, label: string, value: unknown): NumberValidator {
    const v = new NumberValidator(attr, label, value);
    this.validators.push(v);
    return v;
  }

  addBoolean(attr: string, label: string, value: unknown): BooleanValidator {
    const v = new BooleanValidator(attr, label, value);
    this.validators.push(v);
    return v;
  }

  addDate(attr: string, label: string, value: unknown): DateValidator {
    const v = new DateValidator(attr, label, value);
    this.validators.push(v);
    return v;
  }

  addArray(attr: string, label: string, value: unknown): ArrayValidator {
    const v = new ArrayValidator(attr, label, value);
    this.validators.push(v);
    return v;
  }

  addObject(attr: string, label: string, value: unknown): ObjectValidator {
    const v = new ObjectValidator(attr, label, value);
    this.validators.push(v);
    return v;
  }

  validateAll(requiredOnly?: boolean): ValidationResult[] {
    return this.validators.map((v) => v.validate(requiredOnly));
  }

  hasError(requiredOnly?: boolean): boolean {
    return this.validateAll(requiredOnly).some((r) => !r.ok);
  }

  getErrors(requiredOnly?: boolean): ValidationResult[] {
    return this.validateAll(requiredOnly).filter((r) => !r.ok);
  }
}
