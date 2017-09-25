export interface StockContract {
  DateTime: string;
  Open: number;
  Close: number;
}

export class Stock {
  dateTime: string;
  open: number;
  close: number;
}
