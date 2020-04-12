# Changelog

## 0.6.21 (2020-04-12)

- add focus game after closing all dialogs (#606)
- add move poe overlay to top after focusing poe (#608)
- update keyboard support to be always enabled

## 0.6.20 (2020-04-10)

- fix poe overlay losses focus after clicking on it (#602)

## 0.6.19 (2020-04-10)

- update `evaluate-translate` default shortcut to `Alt + T` (#590)
- fix poe overlay not visible after focus change (#587)

## 0.6.18 (2020-04-08)

- add file cache for all requests to further reduce total request count
- add temporary cache for listings to reduce detail requests
- update settings dialog
  - is now an actual window which can be resized
  - has now a responsive design to support smaller viewports
  - ui language is now directly affected
  - zoom is now applied directly
- updata data to 3.10.1c (#555)
- update run iohook only if required (stash navigation)
- fix quality higher than 20% showing a lower value as max (#584)
- fix `Oni-Goroshi Charan's Sword` unable to parse (#575)

## 0.6.17 (2020-04-02)

- add file cache as last resort to ensure a robust api in cost of fresh data
- add unidentifed items support
- add armour/ evasion/ energy shield/ dps with 20% quality (#136)
- update use same height for each mod whether selected or not (#540)
- update evaluate search error display to include the actual reason (#537)
- fix `Titan's Arcade Map of Temporal Chains` mismatched with `Temporal Chains` (my patrons)

## 0.6.16 (2020-03-31)

- add disabled debounce time on max value (#522)
- add configurable fetch count to ensure the request rate is met (#520)
- add clear session on application start and unknown http error (#520)
- update untoggled modifier do now not cancel the search (#512)
- fix rare armour searched with type and name instead of term (#506)

## 0.6.15 (2020-03-27)

- fix an error occured while fetching poe.ninja (#468)
- fix poe overlay does not recognize if poe is no longer active (#485, #486)

## 0.6.14 (2020-03-26)

- add nonunique rarity support (#477)
- add changelog as tray entry and show after update (#471)
- add display trade page error message (#468)
- add renderer logging support log to file (#468)
- update data to 3.10.1
- fix auto update by calling quit and install even after normal quit (#474)
- fix invisible values at map info (#472)

## 0.6.13 (2020-03-25)

- add loading animations
- add keyboard support toggle as tray menu entry (#460)
- add `CmdOrCtrl + F` as supported accelerator (#293, #454)
- add display default values while holding right click (#335)
- update disable keyboard support by defaut (#460)
- update data to 3.10.0f
- fix spacebar closes built in browser by disabling keyboard support (#461)
- fix tooltips not visible by disabling keyboard support (#464)

## 0.6.12 (2020-03-24)

- fix not covering the game correctly (#453, #456)
- fix poe losing focus after alt + tabbing (#455)

## 0.6.11 (2020-03-24)

- add league as fast toggle option (#273)
- add keyboard support for stat ranges (#152)
- update default debounce time to 1s (#426)
- update keyboard empty error to include you may need to start with privileged rights (#361)
- remove requestedExecutionLevel from manifest (#361)
- fix force poe to be active prior copying item data
- fix scroll wheel not working on win7 (#319)
- fix remove typeId only on weapon, armour and accessory (#437, #441)

## 0.6.10 (2020-03-22)

- add missing translations (#413)
- add trade search configurable debounce time with instant support (#426)
- add trade search cancelable (my patrons)
- update always use the item type of maps and flasks as query param (#433)
- update use ico instead of png as tray icon (#403)
- update disable arrow if no mod selected (#425)
- fix run on boot not working (#419)
- fix uncaught exceptions thrown after app relaunch (#411)

## 0.6.9 (2020-03-19)

- fix cloudflare access error
- fix false trojan warning

## 0.6.8 (2020-03-19)

- add bookmark external flag (#373)
- add evaluate original currency (#308)
- update exchange rate to not show inverse rate if item has stack size > 1 (#377)
- update data to 3.10.0d
- update chinese translations (thanks to Eyster87)
- remove simplified chinese (maintenance for 3.10)
- fix missing mod `Trigger a Socketed Spell when you Use a Skill` (#368)
- fix missing map tier filter (#372)
- fix temporary damage_resistance mismatched with damage_resistance_is (#359)

## 0.6.7 (2020-03-18)

- add traditional chinese support (Garena)
- add simplified chinese support (Tencent)
- add seperate ui language
  - polish
- add search placeholder above stat list
- add stash highlight keybinding (#350)
- add stash navigation mode (disabled, normal, inverse)
- add alt modifier to bookmark hotkeys (#362)
- add unique select all (#360)
- update data to 3.10.0c
- fix uncaught exception on alert

## 0.6.6 (2020-03-17)

- add dps mod range (#294)
- add weapon, shield and armour props as mod range (#335)
- fix regex not working with unicode (#338, #340)

## 0.6.5 (2020-03-16)

- add requestExecutionLevel highest (#333)
- add hardware acceleration toggle as tray option (#329, #327)
- add aero is enabled check
- add iohook vc redist error handling (#325)
- update readme (esc/ space) (#330)
- fix multiline `Added Small Passive Skills grant` stat (#324)
- fix singular/ plural stats (#320)

## 0.6.4 (2020-03-15)

- add support for canonical stats variation (#313)
- add support for `Added Small Passive Skills grant` stat (#313)
- fix enchant stats not working (#320)
- fix unique framgents category mismatched as unique map fragmente (#309)

## 0.6.3 (2020-03-15)

- add 3.10 stats (#311)
- add support for windowed mode by moving the overlay on top of poe (#233)
- update default dialog spawns to center (#315)
- fix breaking on tab by settings window on top after tabbing back (#295)
- fix dialog spawns not centered if zoomed (#315)

## 0.6.2 (2020-03-13)

- add periodic version check 
- remove version popup
- fix auto update not working

## 0.6.1 (2020-03-13)

- add allow user to change install path (#296, #300)
- add toggle for auto download (#297)
- update data to 3.10

## 0.6.0 (2020-03-12)

- add auto update (#40)
- add auto launch on boot/ login (#81)
- add relaunch app via tray and menu (#275)
- add localized poe db (#282)
- fix `Clipboard was empty` while using a non US/DEU keyboard layout (#177)
- update data to 3.9.3b
- update accelerators to support `|< (#269)
- update korean translations (thanks to moveoh)

## 0.5.22 (2020-03-08)

- add dialog spawn position as general setting (Cursor, Center) (#210)
- update data to 3.9.3
- remove hotkeys dependency (#261)
- fix timeless jewels missing keystone (#274)
- fix `waterways map of vulnerablity` mismatched with `vulnerablitity skill gem` (#268)

## 0.5.21 (2020-02-23)

 - fix fast tag not working on multiple monitor set-up (#266)

## 0.5.20 (2020-02-23)

- add bulk price support for fast tagging (#253)
- update browser width to consider aspect ratio
- update query to use rarity only for uniques (#231)
- update stats data  
  - fix non negatable mods using it's matched predicate only (#237)
  - fix some unavailable translations because of mismatched predicates
- remove `alt f4` as possible hotkey (#259)
- fix evaluate dialog out of overlay bounds (#258)
- fix stash navigation not working with custom ui scale (#257)
- fix clipboard empty using `alt` as modifier by releasing it prior sending the copy command
- fix query using integers only (#237)

## 0.5.19 (2020-02-20)

- add browser use 70% of primary monitor size (#214)
- add negotiable pricing on double click (#191)
- add min/ max modifier range (#249)
- add preselect links (always, 5-6, 6, never) (#218)
- add ceiling/ flooring for mod ranges if possible (#255)
- update russian translations (thanks to S1ROZHA)
- update pseudo elemental order (fire > cold > lightning) (#255)
- remove some pseudo redundancies (#255)
- remove preselect sockets

## 0.5.18 (2020-02-19)

- add double click tray to open settings (#247)
- add browser use same scale as app (#214)
- add stack size amount to exchange rate (#227)
- update pseudo config (#230)
- update data to 3.9.2f
- fix blurry text after drag-drop (#214)

## 0.5.17 (2020-02-16)

- add `escape` to close browser (#222)
- add ui scaling (#214)
- update modifier range clamp function to reset to 0 (#237)
- update highlight hotkey `CTRL + F` to `ALT + F`
- update hotkeys to be non-passive
- update elemental colors (#241)
- update french translations (thanks to vindoq)
- fix non negated negative mods flipped (#239)
- remove modal flag after minimizing browser (#219, #236)

## 0.5.16 (2020-02-13)

- add fast-tag support to exchange rate (#228)
- add count to evaluation results (#220)
- add missing pseudo mods (#230)
- add elemental color to mods
- add bookmark module (#206)
    - `https://www.poelab.com/` on `num1`
    - `https://wraeclast.com/` on `num2`
- update ux design (#211)
    - new accent color
    - menu keeps height after tab change
    - custom scrollbar
- fix nearby enemies counted as chaos resistance (#213)

## 0.5.15 (2020-02-10)

- add version toggle (#205)
- add result view select (Graph, List) (#204)
- add poe db (ALT + G) (#199)
- add poe ninja by clicking the exchange rate (#206)
- update angular to 9.0.0
- update electron to 8.0.0
- fix local mod used as pseudo (#201)
- fix xml tags in copied item info

## 0.5.14 (2020-02-08)

- add account listing count threshold (#196)
- add listing age mean to tooltip (#196)
- add `price fixing rating` (**\* > 75%, ** > 50%, \* > 25%)
- add alternate evaluate list view (#196)
- add oil exchange rate support (#192)
- update data to 3.9.2e
- remove pseudo count filter (#197)
- fix exchange rate using wrong link count (#187)
- fix using wrong mouse position with scaled os (#195)

## 0.5.13 (2020-02-04)

- add divination card header
- add delay before registering hotkeys after showing window (#177)
- update pseudo mod behaviour
  - use pseudo value instead of single value (#182)
  - remove stat from list if used as pseudo stat (#175)
- increase command throttle time (#188)
- fix authenticated request hitting rate limit (#185)
- fix exchange rate using 6L if no links are present (#187)

## 0.5.12 (2020-02-03)

- add kakao client support (#181)
- add essence support (#180)
- add [project wiki](https://github.com/Kyusung4698/PoE-Overlay/wiki) to faq
- increase keyboard delay (#177)
- remove `restore focus` (#177)
- fix `herald of thunder` wrong item category (#176)
- fix atps instead of crit (#183)

## 0.5.11 (2020-01-30)

- add option based stat support (#110)
  - influenced by #
  - occupied by #
- add currency selector for evaluate (#145)
- update translations
- fix resonators not recognized as currency (#166)
- fix attributes not recognized in pseudo parser (#163)
- fix space closing window outside of the game (#162)

## 0.5.10 (2020-01-29)

- add space as hotkey to close all dialogs (#160)
- add translations files (#158)
- update graph value to be grouped by chaos equivalent (#145)
- update stash width calculation (#159)
- fix `fingerless silk gloves` recognized as `silk gloves` (#157)

## 0.5.9 (2020-01-27)

- add fast price tagging by clicking the desired bar (#147)
  - only works if the item has no note
  - only works if the item is inside a premium stash tab
- fix default values are not added as query parameter (#151)
- fix minion stat is recognized as local stat (#149)

## 0.5.8 (2020-01-26)

- add item base values with 7 day history (#84)
- add online/offline toggle (#104)
- add clear selected button (#105)
- fix undefined id check (#144)
- fix local mod is used instead of global if local is infront of the global (#143)

## 0.5.7 (2020-01-25)

- update map mods to use negated text version if default (#138)
- fix overlay not showing on non steam version (#139)

## 0.5.6 (2020-01-25)

- add vaal support (#134)
- add value range support for quality and gem level (#129)
- add pseudo total energy shield and increased energy shield (#135)
- update evaluate dialog position calculation to be based on actual item values (#131)
- update active check to use executable name instead of window name (#132)
- update poe assets to patch `3.9.2c`
- update default indexed range to 3 days
- fix `clipboard empty...` even though the game is focused (#133)

## 0.5.5 (2020-01-23)

- add autohide overlay if poe is not active (#60, #61, #122)
- update item clipboard handling
  - to be more responsive
  - to retry automatically
- update item level to be unmodified by the modifer settings and uncapped by default (#118)
- fix `Corrupted Blood cannot be inflicted on you (implicit)` mismatched with `Corrupted` (#124)

## 0.5.4 (2020-01-22)

- add map mod warnings (#120, #18)
- update pseudo mods for quality type to be toggleable pseudo mods (#98)
- remove `CTRL + C` and `CTRL + V` as possible keybindings (#117)
- fix `CTRL + W` closes the application (#116)
- fix item type not set as filter if default item type toggle is off (#113)

## 0.5.3 (2020-01-21)

- add map info support (#18)
- add beast support (#86)
- add alternate quality support (#98)
- add stash highlight (CTRL + F) (#106)
- add open item in wiki (ALT + W; CTRL + ALT + W) (#72)
- add support for multi-modifier key bindings
- update tools to misc

## 0.5.2 (2020-01-20)

- add faq to menu
- add title to currency click
- add settings to disable item level, item type and item socket as default (#101)
- add config to pre-select stats
- update item level to use ranged value instead of fixed value
- fix local mod selector not working (#32)
- fix link count (#100)
- fix negated values use wrong range filter (#88)

## 0.5.1 (2020-01-18)

- add alternative text versions of stats to support negate or plural cases (#55, #68, #88, #96, #97)
- add local stat support (#32)
- add common pseudo filters (#7, #29)
- add multiline stat support (#97)
- add `Disable Max Range` as settings (#83)
- add regex caching for better parser performance
- fix evaluate item frame changing size during loading (#83)
- fix commands use wrong text (#95)
- fix blighted map searched as gem (#92)

## 0.5.0 (2020-01-15)

- add veiled mod support (#38)
- add smart multi-currency support (#82)
- add on uses remaining (#44)
- add base type as filter (#74)
- add mod ranges with ±10% (#54, #83)
  - de/increase value by `0.1` via `Alt + Wheel`
  - de/increase value by `1` via `Wheel`
  - de/increase value by `5` via `Shift + Wheel`
  - de/enable via `Right Click`
  - reset via `Wheel Click`
- add select all sockets / links via `Shift + Click` (#57)
- fix `Ctrl + Scroll` moving two tabs by checkin stash window (#77)
- fix commands overwrite clipboard (#89)

## 0.5.0-alpha.0 (2020-01-12)

- add stats type support for (explicit, implicit, crafted, fractured and enchant) (#27, #36, #59, #65)
- add total count to chart (#9)
- fix keybindings not working after tabbing (#76)
- update query to use 1 week listed, only with prices and on/offline.

## 0.4.4 (2020-01-12)

- add splash icon (#51)
- fix currency convert check (#66)
- fix alt key not working as keybinding (#58)
- fix decimal values not being parsed (#62)

## 0.4.3 (2020-01-11)

- add throttling to stash tab scrolling (#50)
- fix item type used as term (#48)

## 0.4.2 (2020-01-11)

- add item category as filter (#11, #39)
- add prophecies item type base (#37)
- add ctrl + scroll as stash tab change (#31)
- add esc to close dialogs (#30)
- add defaults to query toggle (#45)
- add active window check (#10)
- update global hotkeys to be passive (#10) thanks to @Calyx-
- fix mods without values (#39)

## 0.4.1 (2020-01-09)

- add weapon dps, pdps and edps as filter
- add map tier, item quantity, item rarity and monster pack size as filter (#26)
- add influenced shaper, crusader, hunter, elder, redeemer and warlord as filter (#28)
- add auto-select for: corrupted, item level > 80, gem level, map tier, quality if gem, influenced and sockets (#33)
- add clipboard clear after item copying
- update gem level parser (#34)
- update base-item-types (#23, #25)

## 0.4.0 (2020-01-08)

- add offical poe trade api
- add min, max, mode, mean and median to evaluate dialog (#9)
- add item level to query (#12)
- add gem level, gem experience to query (#8, #15)
- add item quality to query (#8, #15)
- add item corrupted to query (#8)
- add already running check
- add tray icon (exit, open settings) (#10)
- add open settings keybinding and exit keybinding as user settings (#10)
- add open search in external browser on CTRL + Click
- add stats-id service maps text to id.
- update base-item-types (#5)
- update validation check for jewels and maps (#16)
- remove poe.trade

## 0.3.0 (2020-01-06)

- add basic filters
- add advanced search
- add evaluate chart
- add sockets to item frame
- add custom shortcuts
- add command module with /hideout /dnd
- add feature settings to layout
- add version check against latest github release
- add user settings window cache for faster display times
- update user settings as own window to mask focusable
- update evaluate dialog to be draggable

## 0.2.0 (2020-01-03)

- add favicon
- add country specific trade api
- add user settings dialog with league and language
- add localforage to store user settings
- add "client string", "words" and "base item type" from content.ggpk as service
- add "stats-descriptions" to translate item mods
- add "map" and "divination cards" translation support
- add languages English, Portuguese, Russian, Thai, German, French, Spanish and Korean
- update use translated item names for poe.trade
- update theme based on poe color palette

## 0.1.0 (2019-12-28)

- add item evaluation
- add currency conversion
- add ingame search
