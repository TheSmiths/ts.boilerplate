module.exports = function (options) {
    var utils = require('gulp-util'),
        git = require('gulp-git'),
        exec = require('child_process').exec,
        fs = require('fs'),
        path = require('path'),
        gitUtils = require('../utils/git-utils.js');

    return {
        /* Initialize the master branch */
        init: function (callback) {
            utils.log("Initializing the master branch");

            git.init(function (err) {
                if (err) { return callback(err); }

                var files = [
                    path.join(options.root, 'component_files', 'README.md'),
                    path.join(options.root, 'project_files', '.gitignore'),
                    options.processRoot];

                exec("cp " + files.join(" "), function (err) {
                    if (err) { return callback(err); }

                    files = [
                        path.join(options.processRoot, '.gitignore'),
                        path.join(options.processRoot, 'README.md')];

                    exec("echo test/\n >> " + files[0], function (err) {
                        if (err) { return callback(err); }

                        gitUtils.addAndCommit(files, 'TheSmiths boilerplate', callback);
                    });
                });
            });
        },

        /* Checkout the master branch */
        checkout: function (callback) { git.checkout('master', callback); }
    };
};
