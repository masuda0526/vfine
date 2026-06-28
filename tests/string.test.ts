import { describe, it, expect } from 'vitest';
import { StringValidator } from '../src/validators/StringValidator.js';

describe('StringValidator', () => {
  describe('required', () => {
    it('空文字はrequiredエラー', () => {
      expect(new StringValidator('s', '名前', '').required().validate().ok).toBe(false);
    });

    it('値ありはOK', () => {
      expect(new StringValidator('s', '名前', 'hello').required().validate().ok).toBe(true);
    });
  });

  describe('optional（requiredなし）', () => {
    it('空の場合は後続ルールをスキップ', () => {
      expect(new StringValidator('s', '名前', '').minLength(5).validate().ok).toBe(true);
    });
  });

  describe('minLength', () => {
    it('OK', () => {
      expect(new StringValidator('s', '名前', 'ab').minLength(2).validate().ok).toBe(true);
    });

    it('エラー', () => {
      const r = new StringValidator('s', '名前', 'a').minLength(2).validate();
      expect(r.ok).toBe(false);
      expect(r.errors[0]).toContain('2');
    });
  });

  describe('maxLength', () => {
    it('OK', () => {
      expect(new StringValidator('s', '名前', 'ab').maxLength(5).validate().ok).toBe(true);
    });

    it('エラー', () => {
      expect(new StringValidator('s', '名前', 'abcdef').maxLength(5).validate().ok).toBe(false);
    });
  });

  describe('length', () => {
    it('OK', () => {
      expect(new StringValidator('s', 'コード', 'ABC').length(3).validate().ok).toBe(true);
    });

    it('エラー', () => {
      expect(new StringValidator('s', 'コード', 'AB').length(3).validate().ok).toBe(false);
    });
  });

  describe('pattern', () => {
    it('マッチはOK', () => {
      expect(new StringValidator('s', '値', 'abc').pattern(/^[a-z]+$/).validate().ok).toBe(true);
    });

    it('不一致はエラー', () => {
      expect(new StringValidator('s', '値', 'ABC').pattern(/^[a-z]+$/).validate().ok).toBe(false);
    });
  });

  describe('email', () => {
    it('有効なメールはOK', () => {
      expect(new StringValidator('e', 'メール', 'user@example.com').email().validate().ok).toBe(true);
    });

    it('無効なメールはエラー', () => {
      expect(new StringValidator('e', 'メール', 'invalid').email().validate().ok).toBe(false);
    });
  });

  describe('url', () => {
    it('有効なURLはOK', () => {
      expect(new StringValidator('u', 'URL', 'https://example.com').url().validate().ok).toBe(true);
    });

    it('無効なURLはエラー', () => {
      expect(new StringValidator('u', 'URL', 'not-a-url').url().validate().ok).toBe(false);
    });
  });

  describe('uuid', () => {
    it('有効なUUIDはOK', () => {
      expect(
        new StringValidator('id', 'ID', '550e8400-e29b-41d4-a716-446655440000').uuid().validate().ok
      ).toBe(true);
    });

    it('無効なUUIDはエラー', () => {
      expect(new StringValidator('id', 'ID', 'not-uuid').uuid().validate().ok).toBe(false);
    });
  });

  describe('numeric', () => {
    it('数字のみはOK', () => {
      expect(new StringValidator('s', '値', '12345').numeric().validate().ok).toBe(true);
    });

    it('英字含むはエラー', () => {
      expect(new StringValidator('s', '値', '123a5').numeric().validate().ok).toBe(false);
    });
  });

  describe('alphanumeric', () => {
    it('英数字はOK', () => {
      expect(new StringValidator('s', '値', 'abc123').alphanumeric().validate().ok).toBe(true);
    });

    it('記号含むはエラー', () => {
      expect(new StringValidator('s', '値', 'abc!').alphanumeric().validate().ok).toBe(false);
    });
  });

  describe('includes', () => {
    it('含む場合はOK', () => {
      expect(new StringValidator('s', '値', 'hello@world').includes('@').validate().ok).toBe(true);
    });

    it('含まない場合はエラー', () => {
      expect(new StringValidator('s', '値', 'helloworld').includes('@').validate().ok).toBe(false);
    });
  });

  describe('startsWith', () => {
    it('OK', () => {
      expect(new StringValidator('s', 'URL', 'https://example.com').startsWith('https').validate().ok).toBe(true);
    });

    it('エラー', () => {
      expect(new StringValidator('s', 'URL', 'http://example.com').startsWith('https').validate().ok).toBe(false);
    });
  });

  describe('endsWith', () => {
    it('OK', () => {
      expect(new StringValidator('s', 'ドメイン', 'example.jp').endsWith('.jp').validate().ok).toBe(true);
    });

    it('エラー', () => {
      expect(new StringValidator('s', 'ドメイン', 'example.com').endsWith('.jp').validate().ok).toBe(false);
    });
  });

  describe('trim', () => {
    it('trimしてrequiredはOK', () => {
      expect(new StringValidator('s', '値', '  hello  ').trim().required().validate().ok).toBe(true);
    });

    it('trimして空文字はrequiredエラー', () => {
      expect(new StringValidator('s', '値', '   ').trim().required().validate().ok).toBe(false);
    });

    it('trimしてminLength検証', () => {
      expect(new StringValidator('s', '値', ' ab ').trim().minLength(2).validate().ok).toBe(true);
    });
  });

  describe('setMessage', () => {
    it('直前ルールのメッセージを変更', () => {
      const v = new StringValidator('s', '自己紹介', 'x');
      const r = v.minLength(10).setMessage('10文字以上で入力してください').validate();
      expect(r.errors[0]).toBe('10文字以上で入力してください');
    });
  });

  describe('rule文字列', () => {
    it('required|email', () => {
      const r = new StringValidator('e', 'メール', '').rule('required|email').validate();
      expect(r.ok).toBe(false);
      expect(r.errors[0]).toContain('必須');
    });

    it('minLength:3|maxLength:10', () => {
      const r = new StringValidator('s', '値', 'ab').rule('minLength:3|maxLength:10').validate();
      expect(r.ok).toBe(false);
    });
  });
});
