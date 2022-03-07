import {
  ChangeDetectorRef,
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { max, range } from "d3-array";
import { scaleLinear } from "d3-scale";
import { fromUnixTime } from "date-fns";
import { StreamTimeChart } from "../stream-time/stream-time-chart";

@Component({
  selector: "hls-stream-time-by-hour",
  templateUrl: "stream-time-by-hour.html",
  encapsulation: ViewEncapsulation.None,
})
export class StreamTimeByHour
  extends StreamTimeChart
  implements OnChanges, OnInit, OnDestroy
{
  readonly height = 136;
  readonly innderPadding = 8;
  readonly barWidth = 24;
  readonly leftMargin = this.innderPadding;
  readonly rightMargin = this.innderPadding;
  readonly step = this.barWidth + this.innderPadding;

  yScale = scaleLinear().range([0, this.height]);
  hours: [number, number][] = [];
  yTicks: number[] = [];

  constructor(cdr: ChangeDetectorRef) {
    super(cdr);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  ngOnChanges() {
    this.hours = this.times.reduce(
      (acc, time) => {
        const idx = fromUnixTime(time[0]).getHours();
        acc[idx][1] += time[1];
        return acc;
      },
      range(0, 24).map((i) => [i, 0] as [number, number])
    );

    this.yScale.domain([0, max(this.hours, (row) => row[1])]);

    this.yTicks = this.yScale.ticks(4);
  }

  getItemByOffset(offsetX: number, offsetY: number) {
    const idx = Math.floor((offsetX - this.leftMargin) / 32);

    if (idx >= 0 && idx <= this.hours.length) {
      return {
        idx,
        x: this.leftMargin + idx * this.step,
        y: this.height - this.yScale(this.hours[idx][1]),
        width: this.barWidth,
        height: 0,
      };
    }

    return { idx: -1, x: 0, y: 0, width: 0, height: 0 };
  }
}
