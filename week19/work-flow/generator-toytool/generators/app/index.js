var Generator = require("yeoman-generator");

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option("babel"); // This method adds support for a `--babel` flag
  }
  collecting() {
    this.log("method 1 just ran");
  }
  creating() {
    this.fs.copyTpl(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
      { title: "tempting_with_yeoman" }
    );
    this.yarnInstall(
      [
        "webpack",
        "webpack-cli",
        "webpack-dev-server",
        "@babel/core",
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-transform-react-jsx",
        "@babel/preset-env",
        "babel-loader",
        "css",
        "css-loader",
        "file-loader",
        "html-webpack-plugin",
        "style-loader",
        "mocha",
        "nyc",
        "@istanbuljs/nyc-config-babel",
        "babel-plugin-istanbul",
      ],
      { dev: true }
    );
    this.yarnInstall(["humps"]);
    this.fs.copyTpl(
      this.templatePath("index.html"),
      this.destinationPath("src/index.html"),
      { title: "Templating with Yeoman" }
    );
    this.fs.copyTpl(
      this.templatePath("Component.js"),
      this.destinationPath("lib/Component.js")
    );
    this.fs.copyTpl(
      this.templatePath("Fragment.js"),
      this.destinationPath("lib/Fragment.js")
    );
    this.fs.copyTpl(
      this.templatePath("Text.js"),
      this.destinationPath("lib/Text.js")
    );
    this.fs.copyTpl(
      this.templatePath("MyCreate.js"),
      this.destinationPath("lib/MyCreate.js")
    );
    this.fs.copyTpl(
      this.templatePath("webpack.config.js"),
      this.destinationPath("webpack.config.js")
    );
    this.fs.copyTpl(
      this.templatePath("index.js"),
      this.destinationPath("src/index.js")
    );
    this.fs.copyTpl(
      this.templatePath(".gitignore"),
      this.destinationPath(".gitignore")
    );
  }
};
