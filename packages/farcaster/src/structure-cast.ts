// needs to not match textcuts incorrectly
// Test here: https://regex101.com/r/kA5zRX/1
/**
 * Node js and browser regex engines are different, so theres the possibility of a hydration issue here.
 * Avoid using this regex in Node.js as it seems to act nondeterministically.
 */
export const urlRegex =
  /((?:(?:(?:https?|ftp):)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:northwesternmutual|travelersinsurance|vermögensberatung|vermögensberater|americanexpress|kerryproperties|sandvikcoromant|americanfamily|bananarepublic|cookingchannel|kerrylogistics|weatherchannel|international|lifeinsurance|travelchannel|wolterskluwer|construction|lplfinancial|scholarships|versicherung|accountants|barclaycard|blackfriday|blockbuster|bridgestone|calvinklein|contractors|creditunion|engineering|enterprises|foodnetwork|investments|kerryhotels|lamborghini|motorcycles|olayangroup|photography|playstation|productions|progressive|redumbrella|williamhill|சிங்கப்பூர்|accountant|apartments|associates|basketball|bnpparibas|boehringer|capitalone|consulting|creditcard|cuisinella|eurovision|extraspace|foundation|healthcare|immobilien|industries|management|mitsubishi|nextdirect|properties|protection|prudential|realestate|republican|restaurant|schaeffler|tatamotors|technology|university|vlaanderen|volkswagen|accenture|alfaromeo|allfinanz|amsterdam|analytics|aquarelle|barcelona|bloomberg|christmas|community|directory|education|equipment|fairwinds|financial|firestone|fresenius|frontdoor|furniture|goldpoint|hisamitsu|homedepot|homegoods|homesense|institute|insurance|kuokgroup|lancaster|landrover|lifestyle|marketing|marshalls|melbourne|microsoft|panasonic|passagens|pramerica|richardli|shangrila|solutions|statebank|statefarm|stockholm|travelers|vacations|yodobashi|موريتانيا|abudhabi|airforce|allstate|attorney|barclays|barefoot|bargains|baseball|boutique|bradesco|broadway|brussels|builders|business|capetown|catering|catholic|cipriani|cityeats|cleaning|clinique|clothing|commbank|computer|delivery|deloitte|democrat|diamonds|discount|discover|download|engineer|ericsson|etisalat|exchange|feedback|fidelity|firmdale|football|frontier|goodyear|grainger|graphics|guardian|hdfcbank|helsinki|holdings|hospital|infiniti|ipiranga|istanbul|jpmorgan|lighting|lundbeck|marriott|maserati|mckinsey|memorial|merckmsd|mortgage|observer|partners|pharmacy|pictures|plumbing|property|redstone|reliance|saarland|samsclub|security|services|shopping|showtime|softbank|software|stcgroup|supplies|training|vanguard|ventures|verisign|woodside|yokohama|السعودية|abogado|academy|agakhan|alibaba|android|athleta|auction|audible|auspost|avianca|banamex|bauhaus|bentley|bestbuy|booking|brother|capital|caravan|careers|channel|charity|chintai|citadel|clubmed|college|cologne|comcast|company|compare|contact|cooking|corsica|country|coupons|courses|cricket|cruises|dentist|digital|domains|exposed|express|farmers|fashion|ferrari|ferrero|finance|fishing|fitness|flights|florist|flowers|forsale|frogans|fujitsu|gallery|genting|godaddy|grocery|guitars|hamburg|hangout|hitachi|holiday|hosting|hoteles|hotmail|hyundai|ismaili|jewelry|juniper|kitchen|komatsu|lacaixa|lanxess|lasalle|latrobe|leclerc|limited|lincoln|markets|monster|netbank|netflix|network|neustar|okinawa|oldnavy|organic|origins|philips|pioneer|politie|realtor|recipes|rentals|reviews|rexroth|samsung|sandvik|schmidt|schwarz|science|shiksha|singles|staples|storage|support|surgery|systems|temasek|theater|theatre|tickets|tiffany|toshiba|trading|walmart|wanggou|watches|weather|website|wedding|whoswho|windows|winners|xfinity|yamaxun|youtube|zuerich|католик|اتصالات|البحرين|الجزائر|العليان|كاثوليك|پاکستان|இந்தியா|abarth|abbott|abbvie|africa|agency|airbus|airtel|alipay|alsace|alstom|amazon|anquan|aramco|author|bayern|beauty|berlin|bharti|bostik|boston|broker|camera|career|casino|center|chanel|chrome|church|circle|claims|clinic|coffee|comsec|condos|coupon|credit|cruise|dating|datsun|dealer|degree|dental|design|direct|doctor|dunlop|dupont|durban|emerck|energy|estate|events|expert|family|flickr|futbol|gallup|garden|george|giving|global|google|gratis|health|hermes|hiphop|hockey|hotels|hughes|imamat|insure|intuit|jaguar|joburg|juegos|kaufen|kinder|kindle|kosher|lancia|latino|lawyer|lefrak|living|locker|london|luxury|madrid|maison|makeup|market|mattel|mobile|monash|mormon|moscow|museum|mutual|nagoya|natura|nissan|nissay|norton|nowruz|office|olayan|online|oracle|orange|otsuka|pfizer|photos|physio|pictet|quebec|racing|realty|reisen|repair|report|review|rocher|rogers|ryukyu|safety|sakura|sanofi|school|schule|search|secure|select|shouji|soccer|social|stream|studio|supply|suzuki|swatch|sydney|taipei|taobao|target|tattoo|tennis|tienda|tjmaxx|tkmaxx|toyota|travel|unicom|viajes|viking|villas|virgin|vision|voting|voyage|vuelos|walter|webcam|xihuan|yachts|yandex|zappos|москва|онлайн|ابوظبي|ارامكو|الاردن|المغرب|امارات|فلسطين|مليسيا|भारतम्|இலங்கை|ファッション|actor|adult|aetna|amfam|amica|apple|archi|audio|autos|azure|baidu|beats|bible|bingo|black|boats|bosch|build|canon|cards|chase|cheap|cisco|citic|click|cloud|coach|codes|crown|cymru|dabur|dance|deals|delta|drive|dubai|earth|edeka|email|epson|faith|fedex|final|forex|forum|gallo|games|gifts|gives|glass|globo|gmail|green|gripe|group|gucci|guide|homes|honda|horse|house|hyatt|ikano|irish|jetzt|koeln|kyoto|lamer|lease|legal|lexus|lilly|linde|lipsy|loans|locus|lotte|lotto|macys|mango|media|miami|money|movie|music|nexus|nikon|ninja|nokia|nowtv|omega|osaka|paris|parts|party|phone|photo|pizza|place|poker|praxi|press|prime|promo|quest|radio|rehab|reise|ricoh|rocks|rodeo|rugby|salon|sener|seven|sharp|shell|shoes|skype|sling|smart|smile|solar|space|sport|stada|store|study|style|sucks|swiss|tatar|tires|tirol|tmall|today|tokyo|tools|toray|total|tours|trade|trust|tunes|tushu|ubank|vegas|video|vodka|volvo|wales|watch|weber|weibo|works|world|xerox|yahoo|ישראל|ایران|بازار|بھارت|سودان|سورية|همراه|भारोत|संगठन|বাংলা|భారత్|ഭാരതം|嘉里大酒店|aarp|able|adac|aero|akdn|ally|amex|arab|army|arpa|arte|asda|asia|audi|auto|baby|band|bank|bbva|beer|best|bike|bing|blog|blue|bofa|bond|book|buzz|cafe|call|camp|care|cars|casa|case|cash|cbre|cern|chat|citi|city|club|cool|coop|cyou|data|date|dclk|deal|dell|desi|diet|dish|docs|dvag|erni|fage|fail|fans|farm|fast|fiat|fido|film|fire|fish|flir|food|ford|free|fund|game|gbiz|gent|ggee|gift|gmbh|gold|golf|goog|guge|guru|hair|haus|hdfc|help|here|hgtv|host|hsbc|icbc|ieee|imdb|immo|info|itau|java|jeep|jobs|jprs|kddi|kids|kiwi|kpmg|kred|land|lego|lgbt|lidl|life|like|limo|link|live|loan|loft|love|ltda|luxe|maif|meet|meme|menu|mini|mint|mobi|moda|moto|name|navy|news|next|nico|nike|ollo|open|page|pars|pccw|pics|ping|pink|play|plus|pohl|porn|post|prod|prof|qpon|read|reit|rent|rest|rich|room|rsvp|ruhr|safe|sale|sarl|save|saxo|scot|seat|seek|sexy|shaw|shia|shop|show|silk|sina|site|skin|sncf|sohu|song|sony|spot|star|surf|talk|taxi|team|tech|teva|tiaa|tips|town|toys|tube|vana|visa|viva|vivo|vote|voto|wang|weir|wien|wiki|wine|work|xbox|yoga|zara|zero|zone|дети|сайт|بارت|بيتك|تونس|شبكة|عراق|عمان|موقع|ڀارت|भारत|ভারত|ভাৰত|ਭਾਰਤ|ભારત|ଭାରତ|ಭಾರತ|ලංකා|アマゾン|クラウド|グーグル|ポイント|组织机构|電訊盈科|香格里拉|aaa|abb|abc|aco|ads|aeg|afl|aig|anz|aol|app|art|aws|axa|bar|bbc|bbt|bcg|bcn|bet|bid|bio|biz|bms|bmw|bom|boo|bot|box|buy|bzh|cab|cal|cam|car|cat|cba|cbn|cbs|ceo|cfa|cfd|com|cpa|crs|dad|day|dds|dev|dhl|diy|dnp|dog|dot|dtv|dvr|eat|eco|edu|esq|eus|fan|fit|fly|foo|fox|frl|ftr|fun|fyi|gal|gap|gay|gdn|gea|gle|gmo|gmx|goo|gop|got|gov|hbo|hiv|hkt|hot|how|ibm|ice|icu|ifm|inc|ing|ink|int|ist|itv|jcb|jio|jll|jmp|jnj|jot|joy|kfh|kia|kim|kpn|krd|lat|law|lds|llc|llp|lol|lpl|ltd|man|map|mba|med|men|mil|mit|mlb|mls|mma|moe|moi|mom|mov|msd|mtn|mtr|nab|nba|nec|net|new|nfl|ngo|nhk|now|nra|nrw|ntt|nyc|obi|one|ong|onl|ooo|org|ott|ovh|pay|pet|phd|pid|pin|pnc|pro|pru|pub|pwc|red|ren|ril|rio|rip|run|rwe|sap|sas|sbi|sbs|sca|scb|ses|sew|sex|sfr|ski|sky|soy|spa|srl|stc|tab|tax|tci|tdk|tel|thd|tjx|top|trv|tui|tvs|ubs|uno|uol|ups|vet|vig|vin|vip|wed|win|wme|wow|wtc|wtf|xin|xxx|xyz|you|yun|zip|бел|ком|мкд|мон|орг|рус|срб|укр|қаз|հայ|קום|عرب|قطر|كوم|مصر|कॉम|नेट|คอม|ไทย|ລາວ|みんな|ストア|セール|中文网|亚马逊|天主教|我爱你|新加坡|淡马锡|诺基亚|飞利浦|ac|ad|ae|af|ag|ai|al|am|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|cr|cu|cv|cw|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|ss|st|su|sv|sx|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tr|tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|yt|za|zm|zw|ελ|ευ|бг|ею|рф|გე|コム|世界|中信|中国|中國|企业|佛山|信息|健康|八卦|公司|公益|台湾|台灣|商城|商店|商标|嘉里|在线|大拿|娱乐|家電|广东|微博|慈善|手机|招聘|政务|政府|新闻|时尚|書籍|机构|游戏|澳門|点看|移动|网址|网店|网站|网络|联通|谷歌|购物|通販|集团|食品|餐厅|香港|닷넷|닷컴|삼성|한국))(?::\d{2,5})?(?:[/?#]\S*)?(?:[^a-z0-9]|$))/gi;

// must not be global for the way we are using it!
// For .split must be: Capture groups join to entire string
export const imgRegex = /(https?:\/\/.*\.(?:png|jpg|gif|webp|jpeg))/i;

export const videoRegex = /(https?:\/\/.*\.(?:mp4|webm|avi|mov))/i;

/** https://github.com/farcasterxyz/protocol/discussions/90 **/
const usernameRegexForSplit = /(^|\s|\.)(@[a-z0-9][a-z0-9-]{0,15}(?:\.eth)?)/gi;
const usernameRegex = /(?:^|\s)@([a-z0-9][a-z0-9-]{0,15}(?:\.eth)?)/gi;

const newlineRegex = /(\n)/gi;

// For .split must be: Capture groups join to entire string
const textcutsForSplit =
  /((?:\b)(?:[^ \.\n,]+)(?:\.)(?:twitter|github|lens|telegram|eth)(?:$| |\n))/gi;
const textcuts =
  /(\b)([^ \.\n,]+)(\.)(twitter|github|lens|telegram|eth)($| |\n)/gi;

// none of these are composable right now
export type StructuredCastUnit =
  | StructuredCastImageUrl
  | StructuredCastTextcut
  | StructuredCastVideo
  | StructuredCastPlaintext
  | StructuredCastMention
  | StructuredCastNewline
  | StructuredCastUrl;

export type StructuredCastUrl = { type: "url"; serializedContent: string };
export type StructuredCastVideo = {
  type: "videourl";
  serializedContent: string;
};
export type StructuredCastImageUrl = {
  type: "imageurl";
  serializedContent: string;
};
export type StructuredCastPlaintext = {
  type: "plaintext";
  serializedContent: string;
};
export type StructuredCastMention = {
  type: "mention";
  serializedContent: string;
};
export type StructuredCastTextcut = {
  type: "textcut";
  serializedContent: string;
  url: string;
};
export type StructuredCastNewline = {
  type: "newline";
  serializedContent: string;
};

function extractMentions(
  structuredCast: StructuredCastUnit
): StructuredCastUnit[] {
  if (structuredCast.type !== "plaintext") return [structuredCast];

  return structuredCast.serializedContent
    .split(usernameRegexForSplit)
    .map((part, i) => {
      const e = usernameRegex.exec(part);
      if (!e) {
        return { type: "plaintext", serializedContent: part };
      }
      return { type: "mention", serializedContent: part };
    });
}

function extractUrlsImagesAndVideos(
  structuredCast: StructuredCastUnit
): StructuredCastUnit[] {
  if (structuredCast.type !== "plaintext") return [structuredCast];

  return structuredCast.serializedContent
    .split(urlRegex)
    .flatMap((p, i): StructuredCastUnit[] => {
      const e = urlRegex.exec(p);
      const isImage = imgRegex.test(p);
      if (isImage) {
        return [{ type: "imageurl", serializedContent: p }];
      }

      const isVideo = videoRegex.test(p);
      if (isVideo) {
        return [{ type: "videourl", serializedContent: p }];
      }

      if (!e) {
        return [{ type: "plaintext", serializedContent: p }];
      }
      let partOutsideUrl = "";
      let endsInSpace = p.endsWith(" ");
      if (endsInSpace) partOutsideUrl = " ";
      let part = p.replace(" ", "");
      // While commas and ) and ] are allowed in urls, people kinda agree not to use them and hence don't. Far more common
      // is a user doing (via www.discove.xyz) or something which breaks the url.
      // So we are going to treat these characters at the end as *not* part of the url if they are not contained elsewhere in the url
      if (part.endsWith(",")) {
        // if only one instance of comma, at the end
        if (part.indexOf(",") === part.length - 1) {
          part = part.slice(0, part.length - 1);
          partOutsideUrl = partOutsideUrl + ",";
        }
      } else if (part.endsWith(")")) {
        // if only one instance of comma, at the end
        if (part.indexOf(")") === part.length - 1 && part.indexOf("(") === -1) {
          part = part.slice(0, part.length - 1);
          partOutsideUrl = partOutsideUrl + ")";
        }
      } else if (part.endsWith("]")) {
        // if only one instance of comma, at the end
        if (part.indexOf("]") === part.length - 1) {
          part = part.slice(0, part.length - 1);
          partOutsideUrl = partOutsideUrl + "]";
        }
      } else if (part.endsWith("!")) {
        part = part.slice(0, part.length - 1);
        partOutsideUrl = partOutsideUrl + "!";
      } else if (part.endsWith(".")) {
        part = part.slice(0, part.length - 1);
        partOutsideUrl = partOutsideUrl + ".";
      } else if (part.endsWith("\n")) {
        // new line character only counts as 1 character as the backslash is an escape
        part = part.slice(0, part.length - 1);
        partOutsideUrl = partOutsideUrl + "\n";
      }

      return [
        { type: "url", serializedContent: part },
        ...(partOutsideUrl !== ""
          ? ([
              { type: "plaintext", serializedContent: partOutsideUrl },
            ] as const)
          : []),
      ];
    });
}

function extractTextcuts(
  structuredCast: StructuredCastUnit
): StructuredCastUnit[] {
  if (structuredCast.type !== "plaintext") return [structuredCast];
  // Split only keeps capturing groups
  return structuredCast.serializedContent
    .split(textcutsForSplit)
    .flatMap((part, i): StructuredCastUnit[] => {
      const e = textcuts.exec(part);

      if (!e) {
        return [{ type: "plaintext", serializedContent: part }];
      } else {
        let url = "";

        switch (e[4]) {
          case "twitter":
            url = `https://www.twitter.com/${e[2]}`;
            break;
          case "github":
            url = `https://www.github.com/${e[2]}`;
            break;
          case "lens":
            url = `https://lenster.xyz/u/${e[2]}.lens`;
            break;
          case "telegram":
            url = `https://t.me/${e[2]}`;
            break;
          case "eth":
            url = `https://rainbow.me/${e[2]}.eth`;
            break;
        }

        let structuredCastUnits: StructuredCastUnit[] = [];
        if (e[1] !== "" && e[1] !== undefined) {
          structuredCastUnits.push({
            type: "plaintext",
            serializedContent: e[1],
          });
        }
        structuredCastUnits.push({
          type: "textcut",
          serializedContent: `${e[2]}.${e[4]}`,
          url: url,
        });
        if (e[5] !== "" && e[5] !== undefined) {
          structuredCastUnits.push({
            type: "plaintext",
            serializedContent: e[5],
          });
        }

        return structuredCastUnits;
      }
    });
}

function extractNewlines(
  structuredCast: StructuredCastUnit
): StructuredCastUnit[] {
  if (structuredCast.type !== "plaintext") return [structuredCast];
  // Split only keeps capturing groups
  return structuredCast.serializedContent
    .split(newlineRegex)
    .map((part, i): StructuredCastUnit => {
      const e = newlineRegex.exec(part);
      if (!e) {
        return { type: "plaintext", serializedContent: part };
      }
      return { type: "newline", serializedContent: "\n" };
    });
}

export function convertCastPlainTextToStructured({
  text,
}: {
  text: string;
}): StructuredCastUnit[] {
  let structuredCast: StructuredCastUnit[] = [
    { type: "plaintext", serializedContent: text ?? "" },
  ];

  structuredCast = structuredCast.flatMap((x) => extractMentions(x));
  structuredCast = structuredCast.flatMap((x) => extractUrlsImagesAndVideos(x));
  structuredCast = structuredCast.flatMap((x) => extractTextcuts(x));
  structuredCast = structuredCast.flatMap((x) => extractNewlines(x));

  return structuredCast;
}
