# Cources - development

Work on the component in separate branch. Your branch should have prefix `development_`, for example: `development_theme-switcher`.
Update `development` branch by creating a pull request.
The `development` branch should be used for testing before deploy on `gh-pages`.

## PR requirements

* Follow styleguide of the project. [Download](http://editorconfig.org/#download) an **Editor Config**  plugin for your editor if needed.
* Create independent components, not spaghetti. We use notation similar to BEM, but with separate classes for modifiers (.-modifier). This should make js-manipulations easier and help you keep code readable and clean. Note that since modifier comes with separate class, it will create higher specificity. Use modifiers only where needed. Remember that **modifiers show state** of the component that can vary depending on context or change dynamically.
* Commit messages should reflect your changes. If you like funny commits, have a break and [go generate some](http://whatthecommit.com/3cb356cfe0892d5179146db1e30c1ab8). When you back to the project, please, write in commit message something that makes sence.
* Do not commit compiled statics such as `.html` and `.css`! (Statics can be committed only for gh-pages)

# Cources - writing lectures

## Structure

For lectures all you need to change:
* theme configuration in `dev\pug\lectures\themes`
* lecture page itself in `dev\pug\pages`

## Branch

Work in a branch with `content_` prefix.
Update `content` branch by creating a pull request.

If you need to update mixins or styles or scripts, you should create separate branch with `development_` prefix.
To test your changes on `development_*` branch you can use `example.pug`


# Build system
All contributors should utilize one build system.
### To install dependencies run:
```
$ npm i
```
### To build for development run:
```
$ npm run dev
```

# Tracking issues

Please, do it.
If there is an issue with build system, do not forget to mention your OS, Node and npm versions.

