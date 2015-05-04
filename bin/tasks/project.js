module.exports = function (options) {
    var utils = require('gulp-util'),
        git = require('gulp-git'),
        _ = require('underscore'),
        exec = require('child_process').exec,
        path = require('path'),
        fs = require('fs'),
        async = require('async');

    return {
    populate: function (callback) {
        /* Dir from and to which we copy templates*/
        var cpDirs = {
                specDir: path.join(options.root, 'project_files', 'spec'),
                gulpDir: path.join(options.root, 'project_files', '.gulp'),
                gulpfile: path.join(options.root, 'project_files', 'gulpfile.js'),
                gitignore: path.join(options.root, 'project_files', '.gitignore'),
                packagejson: path.join(options.root, 'project_files', 'package.json')};

        async.parallel([
            function (done) {
                /* Prepare a lib folder */
                utils.log("Adding a 'lib' folder to the Alloy project.");
                var libPath = path.join(options.projectDir, 'app', 'lib'),
                    readme = "Put your libraries here.";
                exec("mkdir " + libPath, function () {
                    fs.writeFile(path.join(libPath, 'README'), readme, done);
                });
            },
            function (done) {
                /* Prepare a widgets folder */
                utils.log("Adding a 'widgets' folder to the Alloy project.");
                var widPath = path.join(options.projectDir, 'app', 'widgets'),
                    readme = "Put your widgets here.";
                exec("mkdir " + widPath, function () {
                    fs.writeFile(path.join(widPath, 'README'), readme, done);
                });
            },
            function (done) {
                /* Add a readme in the models folder, avoid empty folder for git  */
                var modelPath = path.join(options.projectDir, 'app', 'models'),
                    readme = "Put your models here.";
                fs.writeFile(path.join(modelPath, 'README'), readme, done);
            },
            function (done) {
                /* Adding gitignore */
                utils.log("Adding .gitignore");
                exec("cp -r " + cpDirs.gitignore + " " + options.projectDir, done);
            },
            function (done) {
                /* Copy initial template for spec */
                utils.log("Adding a 'spec' folder to the app. #JasmineWithTiShadow");
                exec("cp -r " + cpDirs.specDir + " " + options.projectDir, done);
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
