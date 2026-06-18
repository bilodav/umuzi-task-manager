module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: "current" },
      },
    ],
  ],
};

// My code is written in moodern ES6 Javascript, and Jest runs in Node.js which does not natively understand import/export. Node uses the older require/modules.export. Therefore babel is used to translate my code to the older code before Jest reads it. This config file essentially tells Babel to translate my code to match whatever version of Node I am currently running.
