export interface ConfidenceIntervalType {
  CNPJ_FUNDO: string;
  mean: number;
  std: number;
  CI90: number;
  CI95: number;
  CI99: number;
  ancora: Date;
  datahora_calc_residual_abs: Date;
  [key: string]: string | number | Date;
}
