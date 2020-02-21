export enum ResultCode {
  success = '200',
  clientError = '400',
  forbidden = '403',
  serverError = '500'
}

export interface ResultVM {
  success: boolean;
  resultCode: string;
  resultException: string;
  resultMessage: string;
}

export interface ResultGenericVM<T> extends ResultVM {
  item: T;
}

export interface ResultListGenericVM<T> extends ResultVM {
  items: T[];
  page?: {
    index: number;
    size: number;
    dataAmount: number;
    pageAmount: number;
  };
}
