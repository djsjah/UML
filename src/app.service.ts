import { Injectable } from '@nestjs/common';

@Injectable()
export class TimeService {
  private timeData: any;

  setTimeData(data: any) {
    this.timeData = data;
  }

  getTimeData() {
    return this.timeData !== undefined ? this.timeData : "Not available yet";
  }
}
