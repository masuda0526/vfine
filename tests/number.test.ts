import { describe, it, expect } from 'vitest';
import { NumberValidator } from '../src/validators/NumberValidator.js';
import { ValidationContext } from '../src/ValidationContext.js';

describe('NumberValidator', () => {
  describe('coerce', () => {
    it('数値はそのまま通す', () => {
      const v = new NumberValidator('n', '数値', 42);
      const r = v.validate();
      expect(r.ok).toBe(true);
    });

    it('数値文字列を変換する', () => {
      const v = new NumberValidator('n', '数値', '25');
      const r = v.required().validate();
      expect(r.ok).toBe(true);
    });

    it('非数値文字列はNaNになりrequiredでエラー', () => {
      const v = new NumberValidator('n', '数値', 'abc');
      const r = v.required().validate();
      expect(r.ok).toBe(false);
    });
  });

  describe('required', () => {
    it('空文字はrequiredエラー', () => {
      const v = new NumberValidator('n', '数値', '');
      const r = v.required().validate();
      expect(r.ok).toBe(false);
      expect(r.errors[0]).toContain('必須');
    });

    it('nullはrequiredエラー', () => {
      const v = new NumberValidator('n', '数値', null);
      const r = v.required().validate();
      expect(r.ok).toBe(false);
    });

    it('値ありはOK', () => {
      const v = new NumberValidator('n', '数値', 0);
      const r = v.required().validate();
      expect(r.ok).toBe(true);
    });
  });

  describe('optional（requiredなし）', () => {
    it('空の場合は後続ルールをスキップしてok', () => {
      const v = new NumberValidator('n', '数値', '');
      const r = v.min(5).validate();
      expect(r.ok).toBe(true);
    });
  });

  describe('min', () => {
    it('最小値以上はOK', () => {
      const v = new NumberValidator('n', '数値', 5);
      expect(v.min(5).validate().ok).toBe(true);
    });

    it('最小値未満はエラー', () => {
      const v = new NumberValidator('n', '数値', 4);
      const r = v.min(5).validate();
      expect(r.ok).toBe(false);
      expect(r.errors[0]).toContain('5');
    });

    it('カスタムメッセージが使われる', () => {
      const v = new NumberValidator('n', '数値', 4);
      const r = v.min(5, '最低5以上にしてください').validate();
      expect(r.errors[0]).toBe('最低5以上にしてください');
    });
  });

  describe('max', () => {
    it('最大値以下はOK', () => {
      const v = new NumberValidator('n', '数値', 100);
      expect(v.max(100).validate().ok).toBe(true);
    });

    it('最大値超過はエラー', () => {
      const v = new NumberValidator('n', '数値', 101);
      const r = v.max(100).validate();
      expect(r.ok).toBe(false);
    });
  });

  describe('integer', () => {
    it('整数はOK', () => {
      expect(new NumberValidator('n', '数値', 5).integer().validate().ok).toBe(true);
    });

    it('小数はエラー', () => {
      expect(new NumberValidator('n', '数値', 5.5).integer().validate().ok).toBe(false);
    });
  });

  describe('positive', () => {
    it('正数はOK', () => {
      expect(new NumberValidator('n', '数値', 1).positive().validate().ok).toBe(true);
    });

    it('0はエラー', () => {
      expect(new NumberValidator('n', '数値', 0).positive().validate().ok).toBe(false);
    });

    it('負数はエラー', () => {
      expect(new NumberValidator('n', '数値', -1).positive().validate().ok).toBe(false);
    });
  });

  describe('negative', () => {
    it('負数はOK', () => {
      expect(new NumberValidator('n', '数値', -1).negative().validate().ok).toBe(true);
    });

    it('0はエラー', () => {
      expect(new NumberValidator('n', '数値', 0).negative().validate().ok).toBe(false);
    });
  });

  describe('multipleOf', () => {
    it('倍数はOK', () => {
      expect(new NumberValidator('n', '数値', 10).multipleOf(5).validate().ok).toBe(true);
    });

    it('非倍数はエラー', () => {
      expect(new NumberValidator('n', '数値', 7).multipleOf(5).validate().ok).toBe(false);
    });
  });

  describe('digits', () => {
    it('桁数内はOK', () => {
      expect(new NumberValidator('n', '数値', 12345).digits(5).validate().ok).toBe(true);
    });

    it('桁数超過はエラー', () => {
      expect(new NumberValidator('n', '数値', 123456).digits(5).validate().ok).toBe(false);
    });
  });

  describe('decimalDigits', () => {
    it('小数桁数内はOK', () => {
      expect(new NumberValidator('n', '数値', 1.23).decimalDigits(2).validate().ok).toBe(true);
    });

    it('小数桁数超過はエラー', () => {
      expect(new NumberValidator('n', '数値', 1.234).decimalDigits(2).validate().ok).toBe(false);
    });
  });

  describe('rule文字列', () => {
    it('rule()でrequired|min|maxを一括指定', () => {
      const v = new NumberValidator('n', '数値', 3);
      expect(v.rule('required|min:0|max:150').validate().ok).toBe(true);
    });

    it('rule()でmin違反', () => {
      const v = new NumberValidator('n', '数値', -1);
      const r = v.rule('min:0').validate();
      expect(r.ok).toBe(false);
    });
  });

  describe('requiredOnly', () => {
    it('requiredOnlyでmin/maxをスキップ', () => {
      const v = new NumberValidator('n', '数値', 200);
      v.required().max(100);
      expect(v.validate(true).ok).toBe(true);
      expect(v.validate(false).ok).toBe(false);
    });
  });

  describe('ValidationContext経由', () => {
    it('複数フィールドを一括検証', () => {
      const ctx = new ValidationContext();
      ctx.addNumber('age', '年齢', '25').required().min(0).max(150).integer();
      ctx.addNumber('score', 'スコア', '-5').required().min(0);
      expect(ctx.hasError()).toBe(true);
      const errs = ctx.getErrors();
      expect(errs).toHaveLength(1);
      expect(errs[0].attr).toBe('score');
    });
  });

  describe('custom', () => {
    it('カスタム関数でtrueはOK', () => {
      const v = new NumberValidator('n', '数値', 10);
      expect(v.custom((val) => (val as number) % 2 === 0).validate().ok).toBe(true);
    });

    it('カスタム関数でfalseはエラー', () => {
      const v = new NumberValidator('n', '数値', 9);
      const r = v.custom((val) => (val as number) % 2 === 0, '偶数を入力してください').validate();
      expect(r.ok).toBe(false);
      expect(r.errors[0]).toBe('偶数を入力してください');
    });
  });
});
