module.exports = function (options) {
    var utils = require('gulp-util'),
        git = require('gulp-git'),
        exec = require('child_process').exec,
        path = require('path'),
        gitUtils = require('../utils/git-utils.js');

    return {
        init: function (callback) {
            git.init(callback);
        },

        /* Create a test branch */
        create: function (callback) {
            git.checkout('test', {args: '-b'}, callback);
        },

        setup: function (callback) {
            exec("rm " + path.join(options.projectDir, "README"), function () {
                exec("mv " + path.join(options.projectDir, "*") + " ./", function () {
                    var gitignore = path.join(options.projectDir, ".gitignore"),
                        travis = path.join(options.projectDir, ".travis.yml"),
                        gulp = path.join(options.projectDir, ".gulp");
                    exec("mv " + [gitignore, travis, gulp, "./"].join(" "), function () {
                        exec("rm -r " + options.projectDir, callback);
                    });
                });
            });
        },

        /* Commit everything on this test branch */
        addAndCommit: function (callback) {
            utils.log("Adding & commiting files on the test branch");
            var msg = 'Add autogenerated test env',
                files = ['.'],
                addOptions = '--all';
                gitUtils.addAndCommit(files, msg, addOptions, callback);
        },

        exportAsSubtree: function (callback) {
            var subdir = path.join('app', options.type === 'widget' ? 'widgets' : 'lib', options.name);
            git.exec({args: 'subtree split -b master -P ' + subdir + ' test'}, callback);
        },
    };
};
