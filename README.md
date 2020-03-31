![GitHub Releases](https://img.shields.io/github/downloads/Kyusung4698/PoE-Overlay/total)
![GitHub Latest Releases](https://img.shields.io/github/downloads/Kyusung4698/PoE-Overlay/latest/total)
![GitHub Release Date](https://img.shields.io/github/release-date/Kyusung4698/PoE-Overlay)
<a href="https://www.patreon.com/bePatron?u=30666721"><img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" alt="Become a Patron" width="85px" height="20px"></a>

# PoE Overlay 0.6.16

An Overlay for Path of Exile. The ***core aspect*** is to blend in with the game. Built with Electron and Angular. 
 
<!-- TOC -->
- [Features](#features)
- [Roadmap](#roadmap)
- [Enduser](#enduser)
- [Developer](#developer)
- [Authors](#authors)
- [License](#license)
- [Acknowledgments](#acknowledgments)
<!-- /TOC -->

## Features

[![Feature Overview As Video](img/video.jpg)](https://www.youtube.com/watch?v=_cJmW8QkQnM)

* Evaluation of items:
    * select your preferred currencies and language
    * uses the official pathofexile.com/trade website
    * a graphical display of the price distribution<br><details>![item](img/item_0.5.8.jpg)</details>
    * filter your search on all supported properties on click<br> <details>![item_filter](img/item_filter_0.5.8.jpg)</details>
    * an in game browser to display the created search<br> <details>![browser](img/item_browser_0.5.8.jpg)</details>
    * lets you price tag the item by clicking the desired bar/value

* Customisable keybindings:  
    * bind in game commands to a custom hotkey
    * premade /hideout on `F5` and /dnd on `F6`
    
* Bookmark
    * bind websites on hotkeys

* Misc:
    * Navigating storage by CTRL + WHEEL
    * Highlighting items by ALT + F

* Menu:
    * an in game menu to change all settings<br> <details>![menu](img/menu_0.5.2.jpg)</details>
    
See the [Wiki](https://github.com/Kyusung4698/PoE-Overlay/wiki) for further details.

## Roadmap

| Module        | Status        | Notes   |
| ------------- |-------------: | ------- |
| Linux         | 50%           | - Allow running this app on Linux
| Trade         | 0%            | - Send messages<br>- Trade UI<br>- etc.
| Overwolf      | 0%            | - Release this app as Overwolf addon to support a fullscreen experience

## Enduser

### Getting Started

These instructions will set you up to run and enjoy the overlay.

#### Supports

* Windows 10 x64
* Windows 7 x64
* Linux coming soon (can be compiled manually)

#### Prerequisites

* Path of Exile ***must be*** in windowed fullscreen mode
* PoE Overlay ***should run*** with privileged rights
* You ***may need*** to install [vc_redist](https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads) 

#### Installing

1. Head over to [Releases](https://github.com/Kyusung4698/PoE-Overlay/releases) and download one of the following files
    1. `poe-overlay-Setup-0.6.16.exe` to install locally. This supports auto update/ auto launch.
    2. `poe-overlay-0.6.16.exe` portable version. This does not support auto update/ auto launch.
2. Run either of your downloaded file
3. Start Path of Exile
4. Wait until you can see `PoE Overlay 0.6.16` in the bottom left corner
5. Hit `f7` and set `Language` and `League` to meet your game settings

#### Shortcuts

You can change these shortcuts in the user settings menu.

|Shortcut        |Description
|---             |---	    
| `ctrl+d`       | Displays the item in a frame and evaluates the price. You can open the offical trade site on click of the currency value
| `f7`           | Opens the user settings menu

Full list below. Click on `Details`.

<details>
  
|Shortcut        |Description
|---             |---	    
| `ctrl+d`       | Displays the item in a frame and evaluates the price. You can open the offical trade site on click of the currency value
| `ctrl+t`       | As above - displays the item translated
| `alt+w`        | Opens item in wiki
| `ctrl+alt+w`   | As above - but in external browser
| `alt+g`        | Opens item in poedb
| `ctrl+alt+g`   | As above - but in external browser
| `alt+q`        | Shows map info (layout, bosses)
| `alt+f`        | Highlights item in stash
| `ctrl+wheel`   | Navigates through stash tabs
| `f5`           | Go to Hideout
| `f6`           | Toggle DND
| `f7`           | Opens the user settings menu
| `f8`           | Exits overlay
| `alt + num1`   | Open `https://www.poelab.com/`
| `alt + num2`   | Open `https://wraeclast.com/`
| `esc`          | Close latest dialog
| `space`        | Close all dialogs

</details>

## Developer

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

#### Prerequisites

Your editor of choice for a node project - like [vscode](https://code.visualstudio.com/).

The first thing to install is [nodejs](https://nodejs.org/en/). Download your matching executable and follow the instructions.

Then you need to install the [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools) from an elevated PowerShell or CMD.exe. This may take a while (10-15min).
```
npm install --global --production windows-build-tools
```

#### Installing

1. Clone the repository. 
2. Open up the folder with your editor.
3. Run ```npm install``` to install all required npm packages.
4. Run ```npm run electron:rebuild``` to generate a executable [robotjs](https://github.com/octalmage/robotjs) version.

That's it. Your Project should now be ready to run:
```
npm run start
```

### Running the tests

These are used to test for eg. the external APIs (poe.ninja, etc.). To run those:
```
npm run ng:test
```

#### And coding style tests

These will run certain linters to keep the project in a clean state.

```
npm run ng:lint
```

### Building

A electron executable can be generate by calling:
```
npm run electron:windows
```

### Built With

* [Electron](https://electronjs.org/) - The desktop app framework
* [Angular](https://angular.io/) - A component framework

### Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

### Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Kyusung4698/PoE-Overlay/tags). 

## Authors

* **Nicklas Ronge** - *Initial work* - [Kyusung4698](https://github.com/Kyusung4698)

See also the list of [contributors](https://github.com/Kyusung4698/PoE-Overlay/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* [Grinding Gear Games](https://www.pathofexile.com/) the game
* [PoE TradeMacro](https://github.com/PoE-TradeMacro/POE-TradeMacro) initial inspiration
* [poe.ninja](https://poe.ninja/) currency values
* [libggpk](https://github.com/MuxaJIbI4/libggpk) parsing content.ggpk
