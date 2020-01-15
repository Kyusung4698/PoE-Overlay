## 0.5.0 (2020-01-15)

* add veiled mod support (#38)
* add smart multi-currency support (#82)
* add on uses remaining (#44)
* add base type as filter (#74)
* add mod ranges with ±10% (#54, #83)
    * de/increase value by `0.1` via `Alt + Wheel`
    * de/increase value by `1` via `Wheel`
    * de/increase value by `5` via `Shift + Wheel`
    * de/enable via `Right Click`
    * reset via `Wheel Click`
* add select all sockets / links via `Shift + Click` (#57)
* fix `Ctrl + Scroll` moving two tabs by checkin stash window (#77)
* fix commands overwrite clipboard (#89)

## 0.5.0-alpha.0 (2020-01-12)

* add stats type support for (explicit, implicit, crafted, fractured and enchant) (#27, #36, #59, #65)
* add total count to chart (#9)
* fix keybindings not working after tabbing (#76)
* update query to use 1 week listed, only with prices and on/offline.

## 0.4.4 (2020-01-12)

* add splash icon (#51)
* fix currency convert check (#66)
* fix alt key not working as keybinding (#58)
* fix decimal values not being parsed (#62)

## 0.4.3 (2020-01-11)

* add throttling to stash tab scrolling (#50)
* fix item type used as term (#48)

## 0.4.2 (2020-01-11)

* add item category as filter (#11, #39)
* add prophecies item type base (#37)
* add ctrl + scroll as stash tab change (#31)
* add esc to close dialogs (#30)
* add defaults to query toggle (#45)
* add active window check (#10)
* update global hotkeys to be passive (#10) thanks to @Calyx-
* fix mods without values (#39)

## 0.4.1 (2020-01-09)

* add weapon dps, pdps and edps as filter
* add map tier, item quantity, item rarity and monster pack size as filter (#26)
* add influenced shaper, crusader, hunter, elder, redeemer and warlord as filter (#28)
* add auto-select for: corrupted, item level > 80, gem level, map tier, quality if gem, influenced and sockets (#33)
* add clipboard clear after item copying
* update gem level parser (#34)
* update base-item-types (#23, #25)

## 0.4.0 (2020-01-08)

* add offical poe trade api
* add min, max, mode, mean and median to evaluate dialog (#9)
* add item level to query (#12)
* add gem level, gem experience to query (#8, #15)
* add item quality to query (#8, #15)
* add item corrupted to query (#8)
* add already running check
* add tray icon (exit, open settings) (#10)
* add open settings keybinding and exit keybinding as user settings (#10)
* add open search in external browser on CTRL + Click
* add stats-id service maps text to id.
* update base-item-types (#5)
* update validation check for jewels and maps (#16)
* remove poe.trade

## 0.3.0 (2020-01-06)

* add basic filters
* add advanced search
* add evaluate chart
* add sockets to item frame
* add custom shortcuts
* add command module with /hideout /dnd
* add feature settings to layout
* add version check against latest github release
* add user settings window cache for faster display times
* update user settings as own window to mask focusable
* update evaluate dialog to be draggable

## 0.2.0 (2020-01-03)

* add favicon
* add country specific trade api
* add user settings dialog with league and language
* add localforage to store user settings
* add "client string", "words" and "base item type" from content.ggpk as service
* add "stats-descriptions" to translate item mods
* add "map" and "divination cards" translation support
* add languages English, Portuguese, Russian, Thai, German, French, Spanish and Korean
* update use translated item names for poe.trade
* update theme based on poe color palette

## 0.1.0 (2019-12-28)

* add item evaluation
* add currency conversion
* add ingame search
