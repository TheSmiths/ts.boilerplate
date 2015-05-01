module.exports = function (options) {
    var utils = require('gulp-util'),
        git = require('gulp-git'),
        exec = require('child_process').exec,
        path = require('path');

    return {
        /* Create a test branch */
        create: function (callback) {
            git.checkout('test', {args: '-b'}, function (err) {
                if (err) { return callback(err); }
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
                exec("mkdir test && ti create " + ticreateOptions.join(" "), function () {
                    exec("alloy new -l ERROR " + options.projectDir, function (err) {
                        if (err) { return callback(err); }
                        /* Prepare a gulpfile to easily launch test */
                        utils.log("Adding taskrunner and gitignore");
                        var gulpfile =  path.join(options.root, 'component_files', options.type, 'gulpfile.js'),
                            gitignore = path.join(options.root, 'component_files', '.gitignore');
                        exec("npm install gulp", function (err) {
                            exec("cp " + [gulpfile, gitignore, options.processRoot].join(' '), callback);
                        });
                    });
                });
            });
        },

        /* Commit everything on this test branch */
        commit: function (callback) {
            
        }
}};
