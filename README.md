<div align="center">
<img src="https://github.com/Stratio/egeo-web/blob/master/src/assets/images/egeo_logo_c.png">
</div>

# Egeo-Cli (Beta)

EGEO-CLI is the open-source util used to automatize document task that we do when develop for stratio and egeo. The goals are to reduce the time and complexity of document for being more productive.

In this repository, you'll find a initial version of this cli. You can discover more in:

* [egeo](https://github.com/Stratio/egeo): The egeo library of components.
* [egeo-web](https://github.com/Stratio/egeo-web): The official website of Egeo where documentation will be available soon.
* [egeo-ui-base](https://github.com/Stratio/egeo-ui-base): A Sass library that helps us to build our styles, including a rewritten Sass version of [flexboxgrid](http://flexboxgrid.com/).
* [egeo-theme](https://github.com/Stratio/egeo-theme): The egeo components are thematizable. This is the official theme used in the Stratio's applications.
* [egeo-starter](https://github.com/Stratio/egeo-starter): A Boilerplate project prepared for work with Egeo 1.x, Angular 2.x, TypeScript, Webpack, Karma, Jasmine and Sass.

## Table of contents

* [About this repo](#about-this-repo)
* [Getting Started](#getting-started)
   * [Dependencies](#dependencies)
   * [Installing](#installing)
   * [Work with egeo-cli](#work-with-egeo-cli)
* [Contributing](#contributing)
* [License](#license)

## About this Repo

This repo includes the code of egeo-cli that parse code and generate README.md files.

## Getting Started

### Dependencies

What you need to run this app:
* [`node`](https://nodejs.org/es/) and `npm`

### Installing

You can install Egeo-cli from npm:

```
npm i -g @stratio/egeo-cli
```

### Work with egeo cli

For now the only option implemented is for document a file in base a code comments, more info in [Wiki page](https://github.com/Stratio/egeo-cli/wiki/Document)

```
egeo-cli [relative path to code]
```

## Contributing

There are many ways to contribute to the Egeo-cli project. [Check our contribution section in the Wiki to learn more](https://github.com/Stratio/egeo-cli/wiki/How-to-contribute).

## License

Egeo-cli is distributed under the Apache 2 license. You may obtain a copy of the license here at:

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)
