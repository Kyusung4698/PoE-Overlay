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
