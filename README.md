# PoE Overlay

A Overlay for Path of Exile. Providing advanced features like evaluating items. The ***core aspect*** is to blend in game. Built with Electron and Angular. 

<!-- TOC -->
- [Status](#status)
- [Features](#features)
- [Roadmap](#roadmap)
- [Enduser](#enduser)
    - [Getting Started](#getting-started)
        - [Prerequisites](#prerequisites)
        - [Installing](#installing)
        - [Shortcuts](#shortcuts)
- [Developer](#developer)
    - [Getting Started](#getting-started-1)
        - [Prerequisites](#prerequisites-1)
        - [Installing](#installing-1)
    - [Running the tests](#running-the-tests)
        - [And coding style tests](#and-coding-style-tests)
    - [Building](#building)
    - [Built With](#built-with)
    - [Contributing](#contributing)
    - [Versioning](#versioning)
- [Authors](#authors)
- [License](#license)
- [Acknowledgments](#acknowledgments)
<!-- /TOC -->

## Status

This project is currently in a ***pilot phase***. If you encounter any bugs or have feature request please open up a issue on github. 

## Features

* Evaluating of item prices from `poe.trade` in `Chaos Orbs` uses the values of the currency market from `poe.ninja` to convert the currencies.
* Modal dialog to open the search result website *in game*.

![ctrl_d_preview](img/ctrl_d_preview.gif)

## Roadmap

| Module        | Status        | Notes   |
| ------------- |-------------: | ------- |
| Core | 50% | + overlay<br>+ global shortcuts<br>- auto updating<br>- user settings like league, custom shortcuts etc.
| Shared | 25% | + item frame<br>+ currency frame<br>- item parser in all languages<br>- item parser reliablity improvement
| Evaluate         | 33%           | + Basic search implemented <br>- Advanced search with filter on modifiers <br>- Chart to display values instead of avg       |
| Trade      | 0%           | - Send messages<br>- Trade UI<br>- etc.       |
| Command        | 0%            | - bind in-game commmands to shortcuts (like /dnd, /hideout) |


## Enduser

### Getting Started

These instructions will get you a executable to run and enjoy the overlay.

#### Prerequisites

* Path of Exile ***must be*** in windowed fullscreen mode
* Path of Exile ***must be*** in language english
* Path of Exile ***must be*** using the latest league (Metamorph)

#### Installing

1. Head over to [Releases](https://github.com/Kyusung4698/PoE-Overlay/releases) and download the latest zip
2. Extract zip
3. Run `poe-overlay.exe`

#### Shortcuts

|Shortcut   |Description
|---        |---	    
| `ctrl+d`  | Displays the item in a frame and evaluates the price. You can open poe.trade on click of the currency value.
| `f5`      | Exits overlay

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
4. Run ```npm run robotjs:rebuild``` to generate a executable [robotjs](https://github.com/octalmage/robotjs) version.

That's it. Your Project should now be ready to run:
```
npm run start
```

### Running the tests

These are used to test for eg. the external APIs (poe.trade, poe.ninja, etc.). To run those:
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
* [poe.trade](https://poe.trade/) item values
* [libggpk](https://github.com/MuxaJIbI4/libggpk) parsing content.ggpk
