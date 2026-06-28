import { describe, it, expect } from 'vitest';
import { ValidationContext } from '../src/ValidationContext.js';

describe('ValidationContext', () => {
  it('全フィールドが有効ならhasErrorはfalse', () => {
    const ctx = new ValidationContext();
    ctx.addString('name', '名前', '山田').required().maxLength(50);
    ctx.addNumber('age', '年齢', '25').required().min(0).max(150);
    expect(ctx.hasError()).toBe(false);
  });

  it('エラーがあればhasErrorはtrue', () => {
    const ctx = new ValidationContext();
    ctx.addString('name', '名前', '').required();
    ctx.addNumber('age', '年齢', 25).required();
    expect(ctx.hasError()).toBe(true);
  });

  it('getErrorsはエラーのあるフィールドのみ返す', () => {
    const ctx = new ValidationContext();
    ctx.addString('name', '名前', '').required();
    ctx.addString('email', 'メール', 'ok@example.com').required().email();
    const errors = ctx.getErrors();
    expect(errors).toHaveLength(1);
    expect(errors[0].attr).toBe('name');
  });

  it('validateAllは全結果を返す', () => {
    const ctx = new ValidationContext();
    ctx.addString('a', 'A', 'x').required();
    ctx.addString('b', 'B', '').required();
    const results = ctx.validateAll();
    expect(results).toHaveLength(2);
    expect(results[0].ok).toBe(true);
    expect(results[1].ok).toBe(false);
  });

  it('requiredOnly=trueで必須チェックのみ', () => {
    const ctx = new ValidationContext();
    ctx.addString('name', '名前', 'x').required().minLength(10);
    expect(ctx.hasError(true)).toBe(false);
    expect(ctx.hasError(false)).toBe(true);
  });

  it('addBooleanが動作する', () => {
    const ctx = new ValidationContext();
    ctx.addBoolean('agree', '同意', 'true').required().isTrue();
    expect(ctx.hasError()).toBe(false);
  });

  it('addDateが動作する', () => {
    const ctx = new ValidationContext();
    ctx.addDate('birth', '生年月日', '2000-01-01').required();
    expect(ctx.hasError()).toBe(false);
  });

  it('addArrayが動作する', () => {
    const ctx = new ValidationContext();
    ctx.addArray('tags', 'タグ', ['a', 'b']).required().minItems(1);
    expect(ctx.hasError()).toBe(false);
  });

  it('addObjectが動作する', () => {
    const ctx = new ValidationContext();
    const shape = {
      name: ctx.addString('name', '名前', ''),
    };
    // 直接addObjectでshapeを使う例
    const ctx2 = new ValidationContext();
    const nameV = ctx2.addString('name', '名前', '山田').required();
    ctx2.addObject('user', 'ユーザー', { name: '山田' }).required();
    expect(ctx2.hasError()).toBe(false);
  });
});
