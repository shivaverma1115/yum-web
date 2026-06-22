export type ITableQrCode = {
  id: string;
  code: string;
  table_number: string;
  qr_image_url: string;
  scan_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type CreateTableQrSingleInput = {
  mode: "single";
  table_number: string;
};

export type CreateTableQrRangeInput = {
  mode: "range";
  from: number;
  to: number;
  prefix?: string;
};

export type CreateTableQrInput =
  | CreateTableQrSingleInput
  | CreateTableQrRangeInput;
