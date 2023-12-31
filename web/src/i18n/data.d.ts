export type UIMessageIds =
  | "updatedAt"
  | "name"
  | "total"
  | "subscribers"
  | "views"
  | "lastDay"
  | "last7Days"
  | "last30Days"
  | "youtubeChannel"
  | "bilibiliChannel"
  | "youtubeStream"
  | "youtubeSchedule"
  | "settings"
  | "toggleDarkMode"
  | "averageViewers"
  | "maximumViewers"
  | "streamHasEnded"
  | "streaming"
  | "streamStartTime"
  | "streamDuration"
  | "youtubeSubscribers"
  | "bilibiliSubscribers"
  | "youtubeViews"
  | "bilibiliViews"
  | "vtuberSelected"
  | "selectLanguage"
  | "recentStreams"
  | "streamViewers"
  | "selectDate"
  | "No Stream"
  | "streamTimeOn"
  | "streamTimes"
  | "liveChat"
  | "paidLiveChat"
  | "normal"
  | "member"
  | "streamLikes"
  | "blue"
  | "lightBlue"
  | "green"
  | "yellow"
  | "orange"
  | "magenta"
  | "red"
  | "Today"
  | "Yesterday"
  | "Tomorrow"
  | "This week"
  | "This month"
  | "This year"
  | "Future";

export type CurrencyMessageIds =
  | "GBP"
  | "JPY"
  | "KRW"
  | "ILS"
  | "EUR"
  | "PHP"
  | "INR"
  | "USD"
  | "AUD"
  | "AED"
  | "ARS"
  | "BAM"
  | "BGN"
  | "BOB"
  | "BYN"
  | "CAD"
  | "CHF"
  | "CLP"
  | "COP"
  | "CRC"
  | "CZK"
  | "DKK"
  | "EGP"
  | "GTQ"
  | "HKD"
  | "HNL"
  | "HRK"
  | "HUF"
  | "ISK"
  | "MXN"
  | "MYR"
  | "NIO"
  | "NOK"
  | "TWD"
  | "NZD"
  | "PEN"
  | "PLN"
  | "BRL"
  | "RON"
  | "RSD"
  | "RUB"
  | "SAR"
  | "SEK"
  | "SGD"
  | "TRY"
  | "ZAR";

export type MessageIds = UIMessageIds | CurrencyMessageIds;

export type Translations = Record<MessageIds, string>;
