import { Component, inject, OnInit, signal } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { DomSanitizer } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { fromEvent, map, startWith, throttleTime } from "rxjs";
import qs from "query-string";
import vtubers from "../../vtubers.json";

import { Header } from "./layout/header/header";
import { Sidenav } from "./layout/sidenav/sidenav";
import { CommonModule } from "@angular/common";

const icons: Array<[string, string]> = [
  [
    "chevron_right",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 6L8.6 7.4l4.6 4.6-4.6 4.6L10 18l6-6-6-6z"/></svg>',
  ],
  [
    "chevron_down",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>',
  ],
  [
    "expand_more",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.6 8.6L12 13.2 7.4 8.6 6 10l6 6 6-6-1.4-1.4z"/></svg>',
  ],
  [
    "eye",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><path d="M9 5a7 7 0 016.4 4c-1.2 2.4-3.6 4-6.4 4s-5.2-1.6-6.4-4A7 7 0 019 5m0-1.4A8.6 8.6 0 001 9a8.6 8.6 0 0016 0 8.6 8.6 0 00-8-5.4zm0 3.6a1.8 1.8 0 010 3.6 1.8 1.8 0 010-3.6m0-1.5a3.3 3.3 0 100 6.6 3.3 3.3 0 000-6.6z"/></svg>',
  ],
  [
    "open_in_new",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 19H5V5h7V3H5a2 2 0 00-2 2v14c0 1.1.9 2 2 2h14a2 2 0 002-2v-7h-2v7zM14 3v2h3.6l-9.8 9.8 1.4 1.4L19 6.4V10h2V3h-7z"/></svg>',
  ],
  [
    "menu",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z"/></svg>',
  ],
  [
    "quick_access",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 20h4v-4h-4m0-2h4v-4h-4m-6-2h4V4h-4m6 4h4V4h-4m-6 10h4v-4h-4m-6 4h4v-4H4m0 10h4v-4H4m6 4h4v-4h-4M4 8h4V4H4v4z"/></svg>',
  ],
  [
    "theme",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 18a6 6 0 01-2.5-.6 6 6 0 000-10.8A6 6 0 0112 6a6 6 0 016 6 6 6 0 01-6 6m8-9.3V4h-4.7L12 .7 8.7 4H4v4.7L.7 12 4 15.3V20h4.7l3.3 3.3 3.3-3.3H20v-4.7l3.3-3.3L20 8.7z"/></svg>',
  ],
  [
    "youtube",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44a2.34 2.34 0 01-1.73-1.73c-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73a14.1 14.1 0 012.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>',
  ],
  [
    "bilibili",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.1 6.4h-1l.9-1c.2-.2.3-.4.3-.8s-.1-.6-.3-.8-.5-.3-.8-.3-.6.1-.8.3l-2.7 2.6h-3.2L7.8 3.8c-.2-.2-.5-.3-.8-.3s-.6.1-.8.3-.3.5-.3.8 0 .6.3.8l.9 1H6a3.3 3.3 0 00-3.4 3.3V17c0 1 .3 1.8 1 2.5s1.4 1 2.3 1h12c1 0 1.7-.4 2.4-1s1-1.4 1-2.4V9.7c0-1-.3-1.7-1-2.3s-1.3-1-2.3-1h0zm1 10.6c0 .3-.2.6-.4.8s-.5.4-.9.4H6.2c-.4 0-.7-.1-.9-.4S5 17.3 5 17V9.9c0-.4 0-.7.3-.9s.5-.3.9-.3h11.6c.4 0 .7 0 1 .3s.2.5.3.9v7h0zM8.6 11c-.4 0-.6.2-.9.4s-.3.5-.3.9v1.2c0 .3.1.6.3.8s.5.4.9.4.6-.1.8-.4.4-.5.4-.8v-1.2c0-.4-.1-.6-.4-.9s-.5-.3-.8-.3h0zm7 0a1.3 1.3 0 00-1.2 1.2v1.3c0 .3 0 .6.3.8s.5.4.9.4.6-.1.8-.4.4-.5.4-.8v-1.2c0-.4-.2-.6-.4-.9s-.5-.3-.8-.3h0z"/></svg>',
  ],
  [
    "timeline",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 14h.5l4.6-4.5a2 2 0 01.5-2 2 2 0 012.8 0c.5.6.7 1.3.5 2l2.6 2.6.5-.1h.5l3.6-3.5L19 8a2 2 0 012-2 2 2 0 012 2 2 2 0 01-2 2h-.5l-3.6 3.5.1.5a2 2 0 01-2 2 2 2 0 01-2-2v-.5l-2.5-2.6h-1l-4.6 4.6.1.5a2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2z"/></svg>',
  ],
  [
    "stream",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5 5a10 10 0 000 14l1.3-1.3a8 8 0 010-11.3L5 4.8m14.2 0l-1.4 1.4a8 8 0 010 11.4L19 19a10 10 0 000-14.2M7.8 7.8a6 6 0 000 8.4l1.4-1.4a4 4 0 010-5.6L7.8 7.8m8.4 0l-1.4 1.4a4 4 0 010 5.6l1.4 1.4a6 6 0 000-8.4M12 10a2 2 0 00-2 2 2 2 0 002 2 2 2 0 002-2 2 2 0 00-2-2z"/></svg>',
  ],
  [
    "tune",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3 17v2h6v-2H3M3 5v2h10V5H3m10 16v-2h8v-2h-8v-2h-2v6h2M7 9v2H3v2h4v2h2V9H7m14 4v-2H11v2h10m-6-4h2V7h4V5h-4V3h-2v6z"/></svg>',
  ],
  [
    "calendar",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"></path></svg>',
  ],
  [
    "refresh",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M17.6 6.3A8 8 0 0012 4a8 8 0 00-8 8 8 8 0 008 8 8 8 0 007.7-6h-2a6 6 0 01-5.7 4 6 6 0 01-6-6 6 6 0 016-6 6 6 0 014.2 1.8L13 11h7V4l-2.4 2.3z"/></svg>',
  ],
  [
    "translate",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12.9 15l-2.6-2.4c1.8-2 3-4.2 3.8-6.6H17V4h-7V2H8v2H1v2h11.2c-.7 2-1.8 3.8-3.2 5.3-1-1-1.7-2.1-2.3-3.3h-2c.7 1.6 1.7 3.2 3 4.6l-5.1 5L4 19l5-5 3.1 3.1.8-2zm5.6-5h-2L12 22h2l1.1-3H20l1.1 3h2l-4.5-12zm-2.6 7l1.6-4.3 1.6 4.3H16z"/></svg>',
  ],
  [
    "more",
    '<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>',
  ],
  [
    "twitter",
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.38c-.83.5-1.75.85-2.72 1.05a4.28 4.28 0 00-7.32 3.91A12.2 12.2 0 013 4.79a4.24 4.24 0 001.33 5.71c-.71 0-1.37-.2-1.95-.5v.03a4.3 4.3 0 003.44 4.21 4.22 4.22 0 01-1.93.07 4.28 4.28 0 004 2.98 8.52 8.52 0 01-6.35 1.78A12.14 12.14 0 008.12 21C16 21 20.33 14.46 20.33 8.79l-.01-.56A8.57 8.57 0 0022.46 6z"/></svg>',
  ],
  [
    "playlist_add",
    '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24"/></g><g><path d="M14,10H3v2h11V10z M14,6H3v2h11V6z M18,14v-4h-2v4h-4v2h4v4h2v-4h4v-2H18z M3,16h7v-2H3V16z"/></g></svg>',
  ],
  [
    "thumb_up",
    '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13.11 5.72l-.57 2.89c-.12.59.04 1.2.42 1.66.38.46.94.73 1.54.73H20v1.08L17.43 18H9.34c-.18 0-.34-.16-.34-.34V9.82l4.11-4.1M14 2L7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.83C7 18.95 8.05 20 9.34 20h8.1c.71 0 1.36-.37 1.72-.97l2.67-6.15c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2zM4 9H2v11h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1z"/></svg>',
  ],
  [
    "sync_problem",
    '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 12c0 2.21.91 4.2 2.36 5.64L3 20h6v-6l-2.24 2.24C5.68 15.15 5 13.66 5 12c0-2.61 1.67-4.83 4-5.65V4.26C5.55 5.15 3 8.27 3 12zm8 5h2v-2h-2v2zM21 4h-6v6l2.24-2.24C18.32 8.85 19 10.34 19 12c0 2.61-1.67 4.83-4 5.65v2.09c3.45-.89 6-4.01 6-7.74 0-2.21-.91-4.2-2.36-5.64L21 4zm-10 9h2V7h-2v6z"/></svg>',
  ],
  [
    "sync",
    '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/></svg>',
  ],
  [
    "check_circle",
    '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>',
  ],
  [
    "arrow_circle_down",
    '<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24"/><path d="M12,4c4.41,0,8,3.59,8,8s-3.59,8-8,8s-8-3.59-8-8S7.59,4,12,4 M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10 c5.52,0,10-4.48,10-10C22,6.48,17.52,2,12,2L12,2z M13,12l0-4h-2l0,4H8l4,4l4-4H13z"/></g></svg>',
  ],
  [
    "information_outline",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>information-outline</title><path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" /></svg>',
  ],
];

@Component({
  standalone: true,
  imports: [Header, Sidenav, RouterModule, MatDialogModule, MatSidenavModule],
  selector: "hls-root",
  templateUrl: "app.component.html",
})
export class AppComponent implements OnInit {
  sidenavShouldOpen = false;
  sidenavMode: string = "side";

  private iconRegistry = inject(MatIconRegistry);
  private sanitizer = inject(DomSanitizer);
  private dialog = inject(MatDialog);

  constructor() {
    for (const [name, svg] of icons) {
      this.iconRegistry.addSvgIconLiteral(
        name,
        this.sanitizer.bypassSecurityTrustHtml(svg)
      );
    }
  }

  ngOnInit() {
    if (typeof window !== "undefined") {
      fromEvent(window, "resize")
        .pipe(
          throttleTime(500),
          startWith(window.innerWidth),
          map(() => window.innerWidth)
        )
        .subscribe((width) => this.updateSidenav(width));

      const value = window.localStorage.getItem("remindMeLater");
      const n = Number.parseInt(value);
      if (Number.isNaN(n) || n < new Date().getTime()) {
        this.dialog.open(MigrationDialog);
      }
    }
  }

  open() {
    this.dialog.open(MigrationDialog);
  }

  updateSidenav(width: number) {
    this.sidenavShouldOpen = width > 1200;
    this.sidenavMode = width > 1200 ? "side" : "over";
  }
}

@Component({
  standalone: true,
  selector: "migration-dialog",
  template: `
    <h1 mat-dialog-title>HoloStats is now superseded by vtstats</h1>
    <div mat-dialog-content>
      <div class="mb-4">
        <span
          class="mr-2 cursor-pointer"
          [class.underline]="locale === 'en'"
          (click)="locale = 'en'"
          >English</span
        >

        <span
          class="mr-2 cursor-pointer"
          [class.underline]="locale === 'ja'"
          (click)="locale = 'ja'"
          >日本語</span
        >

        <span
          class="mr-2 cursor-pointer"
          [class.underline]="locale === 'zh'"
          (click)="locale = 'zh'"
          >中文</span
        >
      </div>

      <ng-container *ngIf="locale === 'en'">
        <p class="mat-headline-6">
          TLDR: HoloStats is now superseded by
          <a class="text-inherit" [attr.href]="link">vtstats</a> and will be
          shut down by the end of October.
        </p>

        <p>
          Hello everyone, I'm PoiScript, the maintainer of HoloStats. Today, I'm
          extremely excited to introduce
          <a class="text-inherit" [attr.href]="link">vtstats</a>, the successor
          to HoloStats.
        </p>

        <p>
          Like the name suggests, vtstats will not be limited to Hololive
          members any more.
          <b
            >Vtubers from other company (e.g. Nijisanji, VShojo) are also
            supported</b
          >. Currently vtstats has already supported more than
          <i>250</i> vtubers and counting.
        </p>

        <p>Moreover, vtstats brings some cool new features, including:</p>

        <ul>
          <li>
            Revenue page, which calculates the all-time earnings for vtubers.
          </li>
          <li>Full-text search for stream with synonym support.</li>
          <li>Receive stream update notifications from discord bot.</li>
          <li>Twitch channels / streams support.</li>
          <li>Some ux improvements and bug fixes</li>
        </ul>

        <p>
          As always, vtstats will continue to be an <b>open-source project</b>.
          You can the source code in the new
          <a
            class="text-inherit"
            target="_blank"
            href="https://github.com/vtstats"
            >GitHub organization</a
          >. Pull requests are always welcome.
        </p>

        <p>
          Also, I have created a
          <a class="text-inherit" href="https://discord.gg/m9NwUzKbkK"
            >Discord channel</a
          >. So, if you encounter any issues that you'd like to report or have
          any suggestions to share, don't hesitate to jump in the channel and
          ping me.
        </p>

        <p>
          For those who have donated me in BuyMeACoffee, I really appreciate
          your support. Please feel free to DM me in discord to ask for the
          <b>Donator</b>
          role.
        </p>

        <p>
          Since all data from HoloStats has been migrated to vtstats now,
          there's no need to keep both websites running. I plan to
          <b>shut down the HoloStats website by the end of October</b>. Starting
          from November, all requests sent to HoloStats will be redirected to
          vtstats.
        </p>

        <p>
          Finally, I want to express my gratitude to all of you for supporting
          this project. I hope you enjoy vtubers, and I'll see you on vtstats.
        </p>

        <p>- poi</p>
      </ng-container>

      <ng-container *ngIf="locale === 'ja'">
        <p>(Translated by DeepL)</p>

        <p class="mat-headline-6">
          TLDR: HoloStats は
          <a class="text-inherit" [attr.href]="link">vtstats</a>
          に取って代わられ、10月末までに閉鎖されます。
        </p>

        <p>
          HoloStats のメンテナ、PoiScript です。今日は、HoloStats の後継となる
          <a class="text-inherit" [attr.href]="link">vtstats</a>
          をご紹介できることを大変嬉しく思います。
        </p>

        <p>
          その名の通り、vtstats はもう Hololive
          メンバーに限定されません。他社（にじさんじ、VShojoなど）のVtuberもサポートします。現在、vtstatsはすでに250人以上のVtuberをサポートしています。
        </p>

        <p>さらに、vtstats は以下のようなクールな新機能を提供します：</p>

        <ul>
          <li>vtuber の歴代収益を計算する収益ページ。</li>
          <li>同義語をサポートしたストリームの全文検索。</li>
          <li>discord bot からストリーム更新通知を受信。</li>
          <li>Twitch チャンネル/ストリームのサポート。</li>
          <li>いくつかの ux の改善とバグ修正</li>
        </ul>

        <p>
          これまで通り、vtstatsはオープンソースプロジェクトであり続けます。ソースコードは新しい
          <a
            class="text-inherit"
            target="_blank"
            href="https://github.com/vtstats"
            >GitHub organization</a
          >
          でご覧いただけます。プルリクエストはいつでも歓迎です。
        </p>

        <p>
          また、<a class="text-inherit" href="https://discord.gg/m9NwUzKbkK"
            >Discord
          </a>
          チャンネルも作りました。もし報告したい問題があったり、共有したい提案があれば、遠慮なくチャンネルに飛び込んで私に
          ping を送ってほしい。
        </p>

        <p>
          BuyMeACoffee
          で私に寄付をしてくださった方々、本当にありがとうございます。Discord
          で私に DM を送り、Donator の role をお願いしてください。
        </p>

        <p>
          HoloStats のデータはすべて vtstats
          に移行したので、両方のウェブサイトを運営し続ける必要はない。10月末までに
          HoloStats のウェブサイトを閉鎖する予定です。11 月からは、HoloStats
          に送られたリクエストはすべて vtstats にリダイレクトされます。
        </p>

        <p>
          最後に、このプロジェクトを応援してくださる皆さんに感謝の気持ちを伝えたいと思います。また
          vtstats でお会いしましょう。
        </p>

        <p>- poi</p>
      </ng-container>

      <ng-container *ngIf="locale === 'zh'">
        <p>(Translated by DeepL)</p>

        <p class="mat-headline-6">
          TLDR: HoloStats 现已被
          <a class="text-inherit" [attr.href]="link">vtstats</a>
          取代，并将于十月底关闭。
        </p>

        <p>
          大家好，我是 HoloStats 的維護者
          PoiScript。今天，我非常興奮地介紹新項目
          <a class="text-inherit" [attr.href]="link">vtstats</a>。
        </p>

        <p>
          正如名稱所示，vtstats 將不再僅限於記錄 Hololive 成員。它還支持其他
          VTuber（例如 Nijisanji、VShojo 等）。目前， vtstats 已經支持了250多位
          VTuber ，並且還在不斷增加中。
        </p>

        <p>此外，vtstats 還帶來了一些很酷的新功能，包括：</p>

        <ul>
          <li>查看 VTuber 的頻道的歷史收益</li>
          <li>全文搜索功能</li>
          <li>從 Discord 機器人接收流更新通知。</li>
          <li>支持 Twitch 頻道合直播</li>
          <li>一些 UX 改進和 Bug 修復</li>
        </ul>

        <p>
          和往常一樣，vtstats將繼續是一個開源項目。您可以在新的<a
            class="text-inherit"
            target="_blank"
            href="https://github.com/vtstats"
            >GitHub organization</a
          >中找到源代碼，我們歡迎 Pull Requests。
        </p>

        <p>
          此外，我已經創建了一個
          <a class="text-inherit" href="https://discord.gg/m9NwUzKbkK"
            >Discord channel</a
          >。因此，如果您遇到任何問題要報告，或者有任何建議要分享，請隨時加入該頻道並提及我。
        </p>

        <p>
          對於那些在 BuyMeACoffee 捐贈給我的人，我真的非常感激您的支持。你可以在
          Discord 中给我發送 DM 以获取 Donator 的 Role。
        </p>

        <p>
          由於 HoloStats 的所有數據現在都已遷移到
          vtstats，因此不再需要保持兩個網站運行。我計劃在十月底前關閉 HoloStats
          網站。從十一月開始，發送到 HoloStats 的所有請求將被重定向到 vtstats。
        </p>

        <p>
          最后，我想對所有支持這個項目的人表示感謝。我希望您享受 VTuber
          带来的乐趣，我們將在 vtstats 上見面。
        </p>

        <p>-- poi</p>
      </ng-container>
    </div>

    <div [align]="'end'" mat-dialog-actions>
      <button mat-button (click)="close()">Remind me later</button>
      <a mat-button color="primary" [attr.href]="link" cdkFocusInitial>
        Take me to vtstats
      </a>
    </div>
  `,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
})
export class MigrationDialog {
  public dialogRef = inject(MatDialogRef);

  locale = "en";
  link = "http://vt.poi.cat/hls-migrate";

  takeMe() {
    window.location.replace(this.link);
  }

  constructor() {
    const mappings = {
      hololive: "hololive-official",
      hololive_en: "hololive-en-official",
      hololive_id: "hololive-id-official",
      sora: "sorahoshi-kirame",
      miko: "rindou-mikoto",
      suisei: "hoshimachi-suisei",
      fubuki: "shirakami-fubuki",
      matsuri: "natsuiro-matsuri",
      haato: "akai-haato",
      aki: "aki-rosenthal",
      mel: "yozora-mel",
      choco: "yuzuki-choco",
      shion: "murasaki-shion",
      aqua: "minato-aqua",
      subaru: "oozora-subaru",
      ayame: "nakiri-ayame",
      pekora: "usada-pekora",
      rushia: "uruha-rushia",
      flare: "shiranui-flare",
      marine: "houshou-marine",
      noel: "shirogane-noel",
      kanata: "amane-kanata",
      coco: "kiryu-coco",
      watame: "tsunomaki-watame",
      towa: "tokoyami-towa",
      himemoriluna: "himemori-luna",
      lamy: "yukihana-lamy",
      nene: "momosuzu-nene",
      botan: "shishiro-botan",
      polka: "omaru-polka",
      laplus: "laplus-darkness",
      lui: "takane-lui",
      koyori: "hakui-koyori",
      chloe: "sakamata-chloe",
      iroha: "kazama-iroha",
      mio: "ookami-mio",
      okayu: "nekomata-okayu",
      korone: "inugami-korone",
      risu: "ayunda-risu",
      moona: "moona-hoshinova",
      iofi: "airani-iofifteen",
      ollie: "kureiji-ollie",
      melfissa: "anya-melfissa",
      reine: "pavolia-reine",
      vestia: "vestia-zeta",
      kaela: "kaela-kovalskia",
      kobo: "kobo-kanaeru",
      amelia: "watson-amelia",
      calliope: "mori-calliope",
      gura: "gawr-gura",
      inanis: "ninomae-inanis",
      kiara: "takanashi-kiara",
      sana: "tsukumo-sana",
      ceres: "ceres-fauna",
      ouro: "ouro-kronii",
      mumei: "nanashi-mumei",
      hakos: "hakos-baelz",
      koseki_bijou: "koseki-bijou",
      shiori_novella: "shiori-novella",
      nerissa_ravencroft: "nerissa-ravencroft",
      miyabi: "hanasaki-miyabi",
      izuru: "kanade-izuru",
      aruran: "arurandeisu",
      rikka: "rikka",
      astel: "astel-leda",
      temma: "kishido-temma",
      roberu: "yukoku-roberu",
      shien: "kageyama-shien",
      oga: "aragami-oga",
      fuma: "yatogami-fuma",
      uyu: "utsugi-uyu",
      gamma: "hizaki-gamma",
      rio: "minase-rio",
      regis_altare: "regis-altare",
      magni_dezmond: "magni-dezmond",
      axel_syrios: "axel-syrios",
      noir_vesper: "axel-syrios",
      ayamy: "ayamy",
      nabi: "aoi-nabi",
      pochimaru: "pochimaru",
      nana: "kagura-nana",
      ui: "shigure-ui",
      luna: "kaguya-luna",
      nekomiya: "nekomiya-hinata",
      tamaki: "inuyama-tamaki",
      gavis_bettel: "gavis-bettel",
      machina_x_flayon: "machina-x-flayon",
      banzoin_hakka: "banzoin-hakka",
      josuiji_shinri: "josuiji-shinri",
    };

    const query = {
      tz: localStorage.getItem("timezone"),
      l: localStorage.getItem("lang"),
      v: (localStorage.getItem("vtuber")
        ? localStorage.getItem("vtuber").split(",")
        : vtubers.vtubers.filter((v) => v.default).map((v) => v.id)
      ).map((id) => mappings[id]),
      c: localStorage.getItem("vts:currencySetting")
        ? JSON.parse(localStorage.getItem("vts:currencySetting"))
        : undefined,
      t: localStorage.getItem("vts:themeSetting")
        ? JSON.parse(localStorage.getItem("vts:themeSetting"))
        : undefined,
      n: localStorage.getItem("vts:nameSetting")
        ? JSON.parse(localStorage.getItem("vts:nameSetting"))
        : undefined,
    };

    this.link = qs.stringifyUrl(
      { url: "http://vt.poi.cat/hls-migrate", query },
      { arrayFormat: "comma" }
    );
  }

  close(): void {
    window.localStorage.setItem(
      "remindMeLater",
      String(new Date().getTime() + 3 * 24 * 60 * 60 * 1000) // 3 day later
    );
    this.dialogRef.close();
  }
}
