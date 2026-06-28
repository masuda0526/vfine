import type { RuleResult } from './types.js';

export abstract class BaseRule {
  protected static DEFAULT_MSG: string = '{label}のバリデーションに失敗しました';
  protected message: string;

  constructor() {
    this.message = (this.constructor as typeof BaseRule).DEFAULT_MSG;
  }

  setMessage(template: string): this {
    this.message = template;
    return this;
  }

  static setDefaultMessage(template: string): void {
    (this as typeof BaseRule).DEFAULT_MSG = template;
  }

  abstract validate(value: unknown, label: string, attr: string): RuleResult;

  protected buildMessage(
    label: string,
    attr: string,
    params?: Record<string, string | number>
  ): string {
    let msg = this.message;
    msg = msg.replace(/\{label\}/g, label).replace(/\{attr\}/g, attr);
    if (params) {
      for (const [key, val] of Object.entries(params)) {
        msg = msg.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val));
      }
    }
    return msg;
  }
}
