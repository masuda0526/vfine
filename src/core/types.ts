export interface RuleResult {
  ok: boolean;
  message?: string;
}

export interface ValidationResult {
  attr: string;
  label: string;
  ok: boolean;
  errors: string[];
}
