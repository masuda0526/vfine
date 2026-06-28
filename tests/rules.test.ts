import { describe, it, expect } from 'vitest';
import { RequiredRule } from '../src/rules/CommonRules.js';
import { MinRule, MaxRule, IntegerRule, MultipleOfRule } from '../src/rules/NumberRules.js';
import { MinLengthRule, MaxLengthRule, EmailRule } from '../src/rules/StringRules.js';
import { MinItemsRule, MaxItemsRule } from '../src/rules/ArrayRules.js';

describe('個別ルールクラス', () => {
  describe('RequiredRule', () => {
    const rule = new RequiredRule();
    it('値ありはOK', () => expect(rule.validate('hello', 'ラベル', 'attr').ok).toBe(true));
    it('空文字はエラー', () => expect(rule.validate('', 'ラベル', 'attr').ok).toBe(false));
    it('nullはエラー', () => expect(rule.validate(null, 'ラベル', 'attr').ok).toBe(false));
    it('undefinedはエラー', () => expect(rule.validate(undefined, 'ラベル', 'attr').ok).toBe(false));
    it('メッセージに{label}が展開される', () => {
      const r = rule.validate(null, 'ユーザー名', 'username');
      expect(r.message).toContain('ユーザー名');
    });
  });

  describe('MinRule', () => {
    it('OK', () => expect(new MinRule(5).validate(5, 'L', 'a').ok).toBe(true));
    it('エラー', () => expect(new MinRule(5).validate(4, 'L', 'a').ok).toBe(false));
    it('{min}プレースホルダーが展開される', () => {
      const r = new MinRule(10).validate(5, 'L', 'a');
      expect(r.message).toContain('10');
    });
  });

  describe('MaxRule', () => {
    it('OK', () => expect(new MaxRule(10).validate(10, 'L', 'a').ok).toBe(true));
    it('エラー', () => expect(new MaxRule(10).validate(11, 'L', 'a').ok).toBe(false));
  });

  describe('IntegerRule', () => {
    it('整数はOK', () => expect(new IntegerRule().validate(5, 'L', 'a').ok).toBe(true));
    it('小数はエラー', () => expect(new IntegerRule().validate(5.1, 'L', 'a').ok).toBe(false));
  });

  describe('MultipleOfRule', () => {
    it('OK', () => expect(new MultipleOfRule(3).validate(9, 'L', 'a').ok).toBe(true));
    it('エラー', () => expect(new MultipleOfRule(3).validate(10, 'L', 'a').ok).toBe(false));
  });

  describe('MinLengthRule', () => {
    it('OK', () => expect(new MinLengthRule(3).validate('abc', 'L', 'a').ok).toBe(true));
    it('エラー', () => expect(new MinLengthRule(3).validate('ab', 'L', 'a').ok).toBe(false));
    it('{min}が展開される', () => {
      expect(new MinLengthRule(5).validate('ab', 'L', 'a').message).toContain('5');
    });
  });

  describe('MaxLengthRule', () => {
    it('OK', () => expect(new MaxLengthRule(5).validate('abc', 'L', 'a').ok).toBe(true));
    it('エラー', () => expect(new MaxLengthRule(5).validate('abcdef', 'L', 'a').ok).toBe(false));
  });

  describe('EmailRule', () => {
    it('OK', () => expect(new EmailRule().validate('user@example.com', 'L', 'a').ok).toBe(true));
    it('エラー', () => expect(new EmailRule().validate('invalid', 'L', 'a').ok).toBe(false));
  });

  describe('MinItemsRule', () => {
    it('OK', () => expect(new MinItemsRule(2).validate([1, 2], 'L', 'a').ok).toBe(true));
    it('エラー', () => expect(new MinItemsRule(2).validate([1], 'L', 'a').ok).toBe(false));
  });

  describe('MaxItemsRule', () => {
    it('OK', () => expect(new MaxItemsRule(3).validate([1, 2], 'L', 'a').ok).toBe(true));
    it('エラー', () => expect(new MaxItemsRule(3).validate([1, 2, 3, 4], 'L', 'a').ok).toBe(false));
  });

  describe('setMessage / setDefaultMessage', () => {
    it('setMessageでインスタンスのメッセージを変更', () => {
      const rule = new MinRule(5);
      rule.setMessage('カスタムメッセージ');
      const r = rule.validate(1, 'L', 'a');
      expect(r.message).toBe('カスタムメッセージ');
    });
  });
});
