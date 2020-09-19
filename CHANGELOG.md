# Changelog

## 1.0.11 (2020-09-20)

- added heist item data & stats
- added heist item properties at the evaluate dialog
- added heist item types at the market
- added heist filter group at the market
- updated the external link behavior to skip in game notification
- fixed an issue causing values at the evaluate dialog to be cut off (#827, #829)
- fixed an issue freezing the launcher (#826)
- fixed an issue with too long stats at the market window (#814)
- fixed an issue using the slider at the settings window (#815)

## 1.0.10 (2020-08-02)

- added whois button to the trade window
- added skip button at the tutorial (#765)
- fixed an issue on lower resolution having invisible market prices (#811)

## 1.0.9 (2020-07-29)

- added stash navigation on ctrl + mousewheel
- added better support for the generate poe.ninja urls based on the league and name (#208)
- added latest_whisper placeholder for commands
- added item images at the search market
- added different step sizes at the exchange market (CTRL 50, SHIFT 25, ALT 5) (#797)
- added experimental horizontal layout (enableable at the settings) for the evaluate dialog (#769)
- updated windows to be draggable by their content (#768)
- fixed an issue at the market enabling sockets to be toggleable

## 1.0.8 (2020-07-09)

- added support for the new cluster jewels stats
- added a new hotkey (default on F10) to manually capture replays
- added a toggle to disable the leaving of a party via kick using the trade finished action (#774)
- added a audio button at the trade settings to customize the notification sound (#786)
- added a lower opacity for market results once they have been requested (#780)
- added the seller name for items and bulk exchanges at the market (#773)
- fixed an issue at the market type filter resulting in a unknown category error (#793)

## 1.0.7 (2020-07-01)

- added the version number at the evaluate, inspect and settings window
- update trade action still interested to be always shown for incoming requests
- update the market history to only show unique requests
- fixed an focus issue occurring when using the trade whisper button
- fixed an issue accessing the clipboard
- fixed an issue querying the map tier

## 1.0.6 (2020-06-25)

- added a history for the market search
- added a received timer at the trade message
- added the player name at the trade message
- added a new action to go to the hideout for outgoing trades
- added support for the new harvest seeds
- update the height of the trade window to be configurable
- fixed an issue parsing unicode item data
- fixed an issue at the market which resulted in crashing the app

## 1.0.5 (2020-06-23)

- added support page with discord and GitHub issues
- added colors for life, mana and energy shield pseudo stats
- added trade filter setting (Incoming & Outgoing, Incoming)
- added trade layout setting (Top To Bottom, Bottom To Top)
- added trade window to be transparent if no active trades and the window is pinned
- update trade action finished to be always shown even if no trade have been initialized
- fixed an focus issue occurring when using the trade whisper button
- fixed an sorting issue at the market result list
- fixed an issue at the inspect frame not showing dps

## 1.0.4 (2020-06-19)

- added 3.11 data
- added `Character Name` setting as fallback

## 1.0.3 (2020-06-18)

- fixed a unhandled error if no event data is available

## 1.0.2 (2020-06-16)

- added misc module
  - stash highlight on `alt+f`
- added trade module
  - support for poe.app, poemap.live, poe.trade, official trade
  - view incoming/ outgoing trades
  - invite/ trade player
  - highlight items in stash
- added open poeprices.info url on source click
- fixed a first time launching error occuring if the GGG API could not be reached

## 1.0.0 (2020-06-10)

- added added a interactive introduction
- added market module
  - item search
  - bulk exchange
- added replay module
  - player death
  - boss kill
- added inspect module
  - item
    - poedb url
    - official wiki url
    - drop location
  - map
    - stat warnings
    - bosses
    - loot
- added placeholder support for commands (@char)
- added vulkan support
- added native fullscreen support
- removed misc module
  - poedb shortcut
  - official wiki shortcut
  - stash navigation
  - stash highlight
- removed stash price tagging

## 0.6.29 (2020-06-10)

- added deprecated warning

## 0.6.28 (2020-05-09)

- added fetch count at the option menu (#692)
- fixed a rate limit issue which was caused by requests not getting marked as finished (#695)

## 0.6.27 (2020-05-08)

- updated rate limiting behavior (#678)
  - accounts for external requests aswell (e.g. done through the website)
  - checks current limit with a single request before sending
    multiple requests if current limit is stale
  - fails instantly if rate is limited
  - fails after 10s if rate is still reached
- fixed search triggered after changing filter if initial search is off (#682)
- fixed corrupted weapons unable to parse (#684, #688)

## 0.6.26 (2020-04-29)

- added enforce rate limit before calling the actual api
- added initial search toggle - off by default (#672)
- added custom user agent to identitfy requests against external apis
- added normalize quality for attack and defense properties (#624)
- added evaluate pricing (clipboard, tagging) - clipboard by default
- updated data to 3.10.1f
- removed auto price tagging
- removed local package version (#662)
- fixed poedb using wrong cn value for helmets (#663)

## 0.6.25 (2020-04-24)

- added delay after closing the dialog via fast tagging (#629)
- added properties query restriction based on item category (#658)
- fixed optimize analyze function (#652)
- fixed stack size over 1000 wrong value used (#656)
- fixed handle leak (#654)

## 0.6.24 (2020-04-22)

- added separate save button to settings menu (#645)
- updated data to 3.10.1e
- fixed poe.ninja showing the relic price variant (#639)
- fixed mouse clicks not registering for price tagging (#629)

## 0.6.23 (2020-04-18)

- added feedback for poeprices.info price prediction (slug@poeprices)
- added alternative poe titles support (#539)
- added focusable (keyboard support) as general setting (#620)
- updated value range component (#595)
  - is now showing both values on hover/ focus even if those are the same
  - is now fully operable via scrolling (# -> default -> #)
  - change scrolling directions to feel more natural
- updated data to 3.10.1d
- fixed font not loading by addeding a local fallback (#635)
- fixed shortcut still active even though poe overlay has no more focus (#627)
- fixed values over 1000 resetting to # (#632)
- fixed mouse position incorrect applied after changing window display settings (#629)

## 0.6.22 (2020-04-13)

- added poeprices.info price prediction (#544)
- fixed multi dialogs not working
- fixed default range values applied on properties (#615)
- fixed apply range only on attack/ defense properties (#617)
- fixed poe overlay does not skip the task bar (#618)

## 0.6.21 (2020-04-12)

- added focus game after closing all dialogs (#606)
- added item frame opacity setting (#607)
- added standard league as fallback if poe ninja returns no results for selected league
- added own min max range settings for properties
- added preselect attack and defense as setting
- updated keyboard support to be always enabled
- removed quality min/ max restriction (#611)
- fixed move poe overlay to top after focusing poe (#608)

## 0.6.20 (2020-04-10)

- fixed poe overlay losses focus after clicking on it (#602)

## 0.6.19 (2020-04-10)

- updated `evaluate-translate` default shortcut to `Alt + T` (#590)
- fixed poe overlay not visible after focus change (#587)

## 0.6.18 (2020-04-08)

- added file cache for all requests to further reduce total request count
- added temporary cache for listings to reduce detail requests
- updated settings dialog
  - is now an actual window which can be resized
  - has now a responsive design to support smaller viewports
  - ui language is now directly affected
  - zoom is now applied directly
- updata data to 3.10.1c (#555)
- updated run iohook only if required (stash navigation)
- fixed quality higher than 20% showing a lower value as max (#584)
- fixed `Oni-Goroshi Charan's Sword` unable to parse (#575)

## 0.6.17 (2020-04-02)

- added file cache as last resort to ensure a robust api in cost of fresh data
- added unidentifed items support
- added armour/ evasion/ energy shield/ dps with 20% quality (#136)
- updated use same height for each mod whether selected or not (#540)
- updated evaluate search error display to include the actual reason (#537)
- fixed `Titan's Arcade Map of Temporal Chains` mismatched with `Temporal Chains` (my patrons)

## 0.6.16 (2020-03-31)

- added disabled debounce time on max value (#522)
- added configurable fetch count to ensure the request rate is met (#520)
- added clear session on application start and unknown http error (#520)
- updated untoggled modifier do now not cancel the search (#512)
- fixed rare armour searched with type and name instead of term (#506)

## 0.6.15 (2020-03-27)

- fixed an error occured while fetching poe.ninja (#468)
- fixed poe overlay does not recognize if poe is no longer active (#485, #486)

## 0.6.14 (2020-03-26)

- added nonunique rarity support (#477)
- added changelog as tray entry and show after updated (#471)
- added display trade page error message (#468)
- added renderer logging support log to file (#468)
- updated data to 3.10.1
- fixed auto updated by calling quit and install even after normal quit (#474)
- fixed invisible values at map info (#472)

## 0.6.13 (2020-03-25)

- added loading animations
- added keyboard support toggle as tray menu entry (#460)
- added `CmdOrCtrl + F` as supported accelerator (#293, #454)
- added display default values while holding right click (#335)
- updated disable keyboard support by defaut (#460)
- updated data to 3.10.0f
- fixed spacebar closes built in browser by disabling keyboard support (#461)
- fixed tooltips not visible by disabling keyboard support (#464)

## 0.6.12 (2020-03-24)

- fixed not covering the game correctly (#453, #456)
- fixed poe losing focus after alt + tabbing (#455)

## 0.6.11 (2020-03-24)

- added league as fast toggle option (#273)
- added keyboard support for stat ranges (#152)
- updated default debounce time to 1s (#426)
- updated keyboard empty error to include you may need to start with privileged rights (#361)
- removed requestedExecutionLevel from manifest (#361)
- fixed force poe to be active prior copying item data
- fixed scroll wheel not working on win7 (#319)
- fixed removed typeId only on weapon, armour and accessory (#437, #441)

## 0.6.10 (2020-03-22)

- added missing translations (#413)
- added trade search configurable debounce time with instant support (#426)
- added trade search cancelable (my patrons)
- updated always use the item type of maps and flasks as query param (#433)
- updated use ico instead of png as tray icon (#403)
- updated disable arrow if no mod selected (#425)
- fixed run on boot not working (#419)
- fixed uncaught exceptions thrown after app relaunch (#411)

## 0.6.9 (2020-03-19)

- fixed cloudflare access error
- fixed false trojan warning

## 0.6.8 (2020-03-19)

- added bookmark external flag (#373)
- added evaluate original currency (#308)
- updated exchange rate to not show inverse rate if item has stack size > 1 (#377)
- updated data to 3.10.0d
- updated chinese translations (thanks to Eyster87)
- removed simplified chinese (maintenance for 3.10)
- fixed missing mod `Trigger a Socketed Spell when you Use a Skill` (#368)
- fixed missing map tier filter (#372)
- fixed temporary damage_resistance mismatched with damage_resistance_is (#359)

## 0.6.7 (2020-03-18)

- added traditional chinese support (Garena)
- added simplified chinese support (Tencent)
- added seperate ui language
  - polish
- added search placeholder above stat list
- added stash highlight keybinding (#350)
- added stash navigation mode (disabled, normal, inverse)
- added alt modifier to bookmark hotkeys (#362)
- added unique select all (#360)
- updated data to 3.10.0c
- fixed uncaught exception on alert

## 0.6.6 (2020-03-17)

- added dps mod range (#294)
- added weapon, shield and armour props as mod range (#335)
- fixed regex not working with unicode (#338, #340)

## 0.6.5 (2020-03-16)

- added requestExecutionLevel highest (#333)
- added hardware acceleration toggle as tray option (#329, #327)
- added aero is enabled check
- added iohook vc redist error handling (#325)
- updated readme (esc/ space) (#330)
- fixed multiline `addeded Small Passive Skills grant` stat (#324)
- fixed singular/ plural stats (#320)

## 0.6.4 (2020-03-15)

- added support for canonical stats variation (#313)
- added support for `addeded Small Passive Skills grant` stat (#313)
- fixed enchant stats not working (#320)
- fixed unique framgents category mismatched as unique map fragmente (#309)

## 0.6.3 (2020-03-15)

- added 3.10 stats (#311)
- added support for windowed mode by moving the overlay on top of poe (#233)
- updated default dialog spawns to center (#315)
- fixed breaking on tab by settings window on top after tabbing back (#295)
- fixed dialog spawns not centered if zoomed (#315)

## 0.6.2 (2020-03-13)

- added periodic version check 
- removed version popup
- fixed auto updated not working

## 0.6.1 (2020-03-13)

- added allow user to change install path (#296, #300)
- added toggle for auto download (#297)
- updated data to 3.10

## 0.6.0 (2020-03-12)

- added auto updated (#40)
- added auto launch on boot/ login (#81)
- added relaunch app via tray and menu (#275)
- added localized poe db (#282)
- fixed `Clipboard was empty` while using a non US/DEU keyboard layout (#177)
- updated data to 3.9.3b
- updated accelerators to support `|< (#269)
- updated korean translations (thanks to moveoh)

## 0.5.22 (2020-03-08)

- added dialog spawn position as general setting (Cursor, Center) (#210)
- updated data to 3.9.3
- removed hotkeys dependency (#261)
- fixed timeless jewels missing keystone (#274)
- fixed `waterways map of vulnerablity` mismatched with `vulnerablitity skill gem` (#268)

## 0.5.21 (2020-02-23)

 - fixed fast tag not working on multiple monitor set-up (#266)

## 0.5.20 (2020-02-23)

- added bulk price support for fast tagging (#253)
- updated browser width to consider aspect ratio
- updated query to use rarity only for uniques (#231)
- updated stats data  
  - fixed non negatable mods using it's matched predicate only (#237)
  - fixed some unavailable translations because of mismatched predicates
- removed `alt f4` as possible hotkey (#259)
- fixed evaluate dialog out of overlay bounds (#258)
- fixed stash navigation not working with custom ui scale (#257)
- fixed clipboard empty using `alt` as modifier by releasing it prior sending the copy command
- fixed query using integers only (#237)

## 0.5.19 (2020-02-20)

- added browser use 70% of primary monitor size (#214)
- added negotiable pricing on double click (#191)
- added min/ max modifier range (#249)
- added preselect links (always, 5-6, 6, never) (#218)
- added ceiling/ flooring for mod ranges if possible (#255)
- updated russian translations (thanks to S1ROZHA)
- updated pseudo elemental order (fire > cold > lightning) (#255)
- removed some pseudo redundancies (#255)
- removed preselect sockets

## 0.5.18 (2020-02-19)

- added double click tray to open settings (#247)
- added browser use same scale as app (#214)
- added stack size amount to exchange rate (#227)
- updated pseudo config (#230)
- updated data to 3.9.2f
- fixed blurry text after drag-drop (#214)

## 0.5.17 (2020-02-16)

- added `escape` to close browser (#222)
- added ui scaling (#214)
- updated modifier range clamp function to reset to 0 (#237)
- updated highlight hotkey `CTRL + F` to `ALT + F`
- updated hotkeys to be non-passive
- updated elemental colors (#241)
- updated french translations (thanks to vindoq)
- fixed non negated negative mods flipped (#239)
- removed modal flag after minimizing browser (#219, #236)

## 0.5.16 (2020-02-13)

- added fast-tag support to exchange rate (#228)
- added count to evaluation results (#220)
- added missing pseudo mods (#230)
- added elemental color to mods
- added bookmark module (#206)
    - `https://www.poelab.com/` on `num1`
    - `https://wraeclast.com/` on `num2`
- updated ux design (#211)
    - new accent color
    - menu keeps height after tab change
    - custom scrollbar
- fixed nearby enemies counted as chaos resistance (#213)

## 0.5.15 (2020-02-10)

- added version toggle (#205)
- added result view select (Graph, List) (#204)
- added poe db (ALT + G) (#199)
- added poe ninja by clicking the exchange rate (#206)
- updated angular to 9.0.0
- updated electron to 8.0.0
- fixed local mod used as pseudo (#201)
- fixed xml tags in copied item info

## 0.5.14 (2020-02-08)

- added account listing count threshold (#196)
- added listing age mean to tooltip (#196)
- added `price fixing rating` (**\* > 75%, ** > 50%, \* > 25%)
- added alternate evaluate list view (#196)
- added oil exchange rate support (#192)
- updated data to 3.9.2e
- removed pseudo count filter (#197)
- fixed exchange rate using wrong link count (#187)
- fixed using wrong mouse position with scaled os (#195)

## 0.5.13 (2020-02-04)

- added divination card header
- added delay before registering hotkeys after showing window (#177)
- updated pseudo mod behaviour
  - use pseudo value instead of single value (#182)
  - removed stat from list if used as pseudo stat (#175)
- increase command throttle time (#188)
- fixed authenticated request hitting rate limit (#185)
- fixed exchange rate using 6L if no links are present (#187)

## 0.5.12 (2020-02-03)

- added kakao client support (#181)
- added essence support (#180)
- added [project wiki](https://github.com/Kyusung4698/PoE-Overlay/wiki) to faq
- increase keyboard delay (#177)
- removed `restore focus` (#177)
- fixed `herald of thunder` wrong item category (#176)
- fixed atps instead of crit (#183)

## 0.5.11 (2020-01-30)

- added option based stat support (#110)
  - influenced by #
  - occupied by #
- added currency selector for evaluate (#145)
- updated translations
- fixed resonators not recognized as currency (#166)
- fixed attributes not recognized in pseudo parser (#163)
- fixed space closing window outside of the game (#162)

## 0.5.10 (2020-01-29)

- added space as hotkey to close all dialogs (#160)
- added translations files (#158)
- updated graph value to be grouped by chaos equivalent (#145)
- updated stash width calculation (#159)
- fixed `fingerless silk gloves` recognized as `silk gloves` (#157)

## 0.5.9 (2020-01-27)

- added fast price tagging by clicking the desired bar (#147)
  - only works if the item has no note
  - only works if the item is inside a premium stash tab
- fixed default values are not addeded as query parameter (#151)
- fixed minion stat is recognized as local stat (#149)

## 0.5.8 (2020-01-26)

- added item base values with 7 day history (#84)
- added online/offline toggle (#104)
- added clear selected button (#105)
- fixed undefined id check (#144)
- fixed local mod is used instead of global if local is infront of the global (#143)

## 0.5.7 (2020-01-25)

- updated map mods to use negated text version if default (#138)
- fixed overlay not showing on non steam version (#139)

## 0.5.6 (2020-01-25)

- added vaal support (#134)
- added value range support for quality and gem level (#129)
- added pseudo total energy shield and increased energy shield (#135)
- updated evaluate dialog position calculation to be based on actual item values (#131)
- updated active check to use executable name instead of window name (#132)
- updated poe assets to patch `3.9.2c`
- updated default indexed range to 3 days
- fixed `clipboard empty...` even though the game is focused (#133)

## 0.5.5 (2020-01-23)

- added autohide overlay if poe is not active (#60, #61, #122)
- updated item clipboard handling
  - to be more responsive
  - to retry automatically
- updated item level to be unmodified by the modifer settings and uncapped by default (#118)
- fixed `Corrupted Blood cannot be inflicted on you (implicit)` mismatched with `Corrupted` (#124)

## 0.5.4 (2020-01-22)

- added map mod warnings (#120, #18)
- updated pseudo mods for quality type to be toggleable pseudo mods (#98)
- removed `CTRL + C` and `CTRL + V` as possible keybindings (#117)
- fixed `CTRL + W` closes the application (#116)
- fixed item type not set as filter if default item type toggle is off (#113)

## 0.5.3 (2020-01-21)

- added map info support (#18)
- added beast support (#86)
- added alternate quality support (#98)
- added stash highlight (CTRL + F) (#106)
- added open item in wiki (ALT + W; CTRL + ALT + W) (#72)
- added support for multi-modifier key bindings
- updated tools to misc

## 0.5.2 (2020-01-20)

- added faq to menu
- added title to currency click
- added settings to disable item level, item type and item socket as default (#101)
- added config to pre-select stats
- updated item level to use ranged value instead of fixed value
- fixed local mod selector not working (#32)
- fixed link count (#100)
- fixed negated values use wrong range filter (#88)

## 0.5.1 (2020-01-18)

- added alternative text versions of stats to support negate or plural cases (#55, #68, #88, #96, #97)
- added local stat support (#32)
- added common pseudo filters (#7, #29)
- added multiline stat support (#97)
- added `Disable Max Range` as settings (#83)
- added regex caching for better parser performance
- fixed evaluate item frame changing size during loading (#83)
- fixed commands use wrong text (#95)
- fixed blighted map searched as gem (#92)

## 0.5.0 (2020-01-15)

- added veiled mod support (#38)
- added smart multi-currency support (#82)
- added on uses remaining (#44)
- added base type as filter (#74)
- added mod ranges with ±10% (#54, #83)
  - de/increase value by `0.1` via `Alt + Wheel`
  - de/increase value by `1` via `Wheel`
  - de/increase value by `5` via `Shift + Wheel`
  - de/enable via `Right Click`
  - reset via `Wheel Click`
- added select all sockets / links via `Shift + Click` (#57)
- fixed `Ctrl + Scroll` moving two tabs by checkin stash window (#77)
- fixed commands overwrite clipboard (#89)

## 0.5.0-alpha.0 (2020-01-12)

- added stats type support for (explicit, implicit, crafted, fractured and enchant) (#27, #36, #59, #65)
- added total count to chart (#9)
- fixed keybindings not working after tabbing (#76)
- updated query to use 1 week listed, only with prices and on/offline.

## 0.4.4 (2020-01-12)

- added splash icon (#51)
- fixed currency convert check (#66)
- fixed alt key not working as keybinding (#58)
- fixed decimal values not being parsed (#62)

## 0.4.3 (2020-01-11)

- added throttling to stash tab scrolling (#50)
- fixed item type used as term (#48)

## 0.4.2 (2020-01-11)

- added item category as filter (#11, #39)
- added prophecies item type base (#37)
- added ctrl + scroll as stash tab change (#31)
- added esc to close dialogs (#30)
- added defaults to query toggle (#45)
- added active window check (#10)
- updated global hotkeys to be passive (#10) thanks to @Calyx-
- fixed mods without values (#39)

## 0.4.1 (2020-01-09)

- added weapon dps, pdps and edps as filter
- added map tier, item quantity, item rarity and monster pack size as filter (#26)
- added influenced shaper, crusader, hunter, elder, redeemer and warlord as filter (#28)
- added auto-select for: corrupted, item level > 80, gem level, map tier, quality if gem, influenced and sockets (#33)
- added clipboard clear after item copying
- updated gem level parser (#34)
- updated base-item-types (#23, #25)

## 0.4.0 (2020-01-08)

- added offical poe trade api
- added min, max, mode, mean and median to evaluate dialog (#9)
- added item level to query (#12)
- added gem level, gem experience to query (#8, #15)
- added item quality to query (#8, #15)
- added item corrupted to query (#8)
- added already running check
- added tray icon (exit, open settings) (#10)
- added open settings keybinding and exit keybinding as user settings (#10)
- added open search in external browser on CTRL + Click
- added stats-id service maps text to id.
- updated base-item-types (#5)
- updated validation check for jewels and maps (#16)
- removed poe.trade

## 0.3.0 (2020-01-06)

- added basic filters
- added advanced search
- added evaluate chart
- added sockets to item frame
- added custom shortcuts
- added command module with /hideout /dnd
- added feature settings to layout
- added version check against latest github release
- added user settings window cache for faster display times
- updated user settings as own window to mask focusable
- updated evaluate dialog to be draggable

## 0.2.0 (2020-01-03)

- added favicon
- added country specific trade api
- added user settings dialog with league and language
- added localforage to store user settings
- added "client string", "words" and "base item type" from content.ggpk as service
- added "stats-descriptions" to translate item mods
- added "map" and "divination cards" translation support
- added languages English, Portuguese, Russian, Thai, German, French, Spanish and Korean
- updated use translated item names for poe.trade
- updated theme based on poe color palette

## 0.1.0 (2019-12-28)

- added item evaluation
- added currency conversion
- added ingame search
