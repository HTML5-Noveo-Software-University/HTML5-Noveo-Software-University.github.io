# Cources - development

Work on the component in separate branch. Your branch should have prefix `development_`, for example: `development_theme-switcher`.
Update this branch by creating a pull request.
This branch should be used for testing before deploy on `gh-pages`.

## PR requirements

* Follow styleguide of the project. [Download](http://editorconfig.org/#download) an **Editor Config**  plugin for your editor if needed.
* Create independent components, not spaghetti. BEM-101 notation should help you keep code readable and clean.
* Commit messages should reflect your changes. If you like funny commits, have a break and [go generate some](http://whatthecommit.com/3cb356cfe0892d5179146db1e30c1ab8). When you back to the project, please, commit something that makes sence.
* Do not commit statics!

## Build system
* All contributors should utilize one build system.
* To install dependencies run:
```
$ npm i
```
* To build for development run:
```
$ npm run dev
```

## Tracking issues

Please, do it.
If there is an issue with build system, do not forget to mention your OS, Node and npm versions.
