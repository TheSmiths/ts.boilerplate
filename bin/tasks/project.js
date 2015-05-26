module.exports = function (options) {
    var utils = require('gulp-util'),
        git = require('gulp-git'),
        _ = require('underscore'),
        exec = require('child_process').exec,
        path = require('path'),
        fs = require('fs'),
        async = require('async');

    return {
    create: function (callback) {
        var ticreateOptions = [
                "-t app",
                "-n " + options.projectName,
                "-p all",
                "-d " + options.projectRoot,
                "--id " + options.projectId,
                "--no-prompt",
                "--log-level warn"];

        /* Create a test app */
        utils.log("Creating Titanium & Alloy test project");
        exec("ti create " + ticreateOptions.join(" "), function () {
            exec("alloy new -l ERROR " + options.projectDir, callback);
        });
    },

    /* Used to populate a test directory for a library, a widget or a module. In other words, it
     * creates an alloy project and copy spec file for jasmine, and calabash. */
    populate: function (callback) {
        /* Dir from and to which we copy templates*/
        var cpDirs = {
                specDir: path.join(options.root, 'project_files', 'spec'),
                featDir: path.join(options.root, 'project_files', 'features'),
                i18nDir: path.join(options.root, 'project_files', 'i18n'),
                gulpDir: path.join(options.root, 'project_files', '.gulp'),
                libDir: path.join(options.projectDir, 'app', 'lib'),
                widDir: path.join(options.projectDir, 'app', 'widgets'),
                modelDir: path.join(options.projectDir, 'app', 'models'),
                gulpfile: path.join(options.root, 'project_files', 'gulpfile.js'),
                gitignore: path.join(options.root, 'project_files', 'gitignore'),
                view: path.join(options.projectDir, 'app', 'views', 'index.xml'),
                travis: path.join(options.root, 'project_files', '.travis.yml'),
                packagejson: path.join(options.root, 'project_files', 'package.json')};

        /* Lot of little tasks to do, all might be done in parallel */
        async.parallel([
            function (done) {
                /* Prepare a lib folder */
                utils.log("Adding a 'lib' folder to the Alloy project.");
                var readme = "Put your libraries here.";
                exec("mkdir " + cpDirs.libDir, function () {
                    fs.writeFile(path.join(cpDirs.libDir, 'README'), readme, done);
                });
            },
            function (done) {
                /* Prepare a widgets folder */
                utils.log("Adding a 'widgets' folder to the Alloy project.");
                var readme = "Put your widgets here.";
                exec("mkdir " + cpDirs.widDir, function () {
                    fs.writeFile(path.join(cpDirs.widDir, 'README'), readme, done);
                });
            },
            function (done) {
                /* Add a readme in the models folder, avoid empty folder for git  */
                var readme = "Put your models here.";
                fs.writeFile(path.join(cpDirs.modelDir, 'README'), readme, done);
            },
            function (done) {
                /* Show a little i18n example :) */
                var content = fs
                    .readFileSync(cpDirs.view)
                    .toString()
                    .replace(/Hello, World/, 'L(\'welcome\')');
                fs.writeFile(cpDirs.view, content, done);
            },
            function (done) {
                utils.log("Adding gitignore");
                exec("cp -r " + cpDirs.gitignore + " " + path.join(options.projectDir, '.gitignore'), done);
            },
            function (done) {
                /* Adding .travis  */
                utils.log("Adding travis");
                exec("cp -r " + [cpDirs.travis, options.projectDir].join(" "), done);
            },
            function (done) {
                /* Copy initial template for i18n, feature and specs */
                utils.log("Adding 'i18n', 'spec' and 'features' folders to the app.");
                exec("cp -r " + [cpDirs.i18nDir, cpDirs.specDir, cpDirs.featDir, options.projectDir].join(" "), done);
            },
            function (done) {
                /* Copy all task runner stuff */
                utils.log("Adding task runner to the test app. #Gulp");
                exec("cp " + cpDirs.gulpfile + " " + options.projectDir);
                exec("cp -r " + cpDirs.gulpDir + " " + options.projectDir, done);
            }, function (done) {
                /* Copy package.json to handle task runner dependencies */
                utils.log("Copying package.json to handle task runner dependencies");
                exec("cp " + cpDirs.packagejson + " " + options.projectDir, done);
            }], function (err) {
                if (err) { return callback(err); }
                /* Install dependencies */
                utils.log("Install dependencies");
                process.chdir(options.projectDir);
                exec("npm install", function(err) {
                    process.chdir(options.processRoot);
                    callback(err);
                });
            }
        );
    }
}};
