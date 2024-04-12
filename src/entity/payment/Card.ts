export class Card {

  private number: number;
  private expired: Date;
  private cardholder: string;
  private cvv: number;

  constructor(number: number, expired: Date, cardholder: string, cvv: number) {
    this.number = number;
    this.expired = expired;
    this.cardholder = cardholder;
    this.cvv = cvv;
  }
}
