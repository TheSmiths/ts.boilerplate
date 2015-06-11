module.exports = function (options) {
    var utils = require('gulp-util'),
        git = require('gulp-git'),
        exec = require('child_process').exec,
        path = require('path'),
        fs   = require('fs'),
        gitUtils = require('../utils/git-utils.js');

    /* Check if a branch exist. Will be used to know if we should update or not that branch */
    function anyBranch(branchName, callback) {
        git.exec({args: "branch"}, function (err, stdout) {
            if (err) { utils.log(utils.colors.red(err)); }
            console.log(stdout);
            callback(stdout && stdout.match(new RegExp(" " + branchName + "\\n", "g")) !== null);
        });
    }

    return {

        /* Because we are gonna replace existing files and, probably moves to some other 
         * branches, it's safer to ensure there is no file to be committed */
        ensureGitStatus: function (callback) {
            utils.log("Ensuring git consistency");
            gitUtils.checkIfCommited(1, 1, function (err) {
                if (err) {
                    return callback("Your git branch isn't clean.\n"+
                        "Please commit or stash your changes before attempting an update.");
                }

                callback();
            });
        },

        /* Checkout the test branch if any and copy the new gulpfiles */
        updateTestBranch: function (callback) {
            anyBranch("test", function (branchExist) {
                if (!branchExist) { 
                    utils.log(utils.colors.yellow("No branch 'test'; Skipping this step."));
                    return callback(); }
                
                git.checkout("test", function (err) {
                    if (err) { return callback (); }
                    /* Test branch is supposed to be at the root of the project so... */    
                    var gulpfile = path.join(options.root, 'project_files', 'gulpfile.js'),
                        dotgulp  = path.join(options.root, 'project_files', '.gulp'),
                        dest     = options.processRoot;
                        
                    exec("cp -r " + [gulpfile, dotgulp, dest].join(" "), function (err) {
                        if (err) { return callback(err); }
                        gitUtils.addAndCommit(dest, "Update boilerplate runner files", function (err) {
                            if (err) { return callback(err); }

                            utils.log(utils.colors.cyan("Branch 'test' updated! Yeay!"));
                            options.updated.push("test'");
                            callback();
                        });
                    });
                });

            });
        },

        updateMasterBranch: function (callback) {
            anyBranch("master", function (branchExist) {
                if (!branchExist) {
                    utils.log(utils.colors.yellow("No branch 'master'; Skipping this step."));
                    return callback("skipped");
                }
                
                git.checkout("master", function (err) {
                    if (err) { return callback (); }

                    /* Find the app root folder if any */
                    function find_tiapp (currentFolder) {
                        var files = fs.readdirSync(currentFolder),
                            tiappFolder = null;
                        
                        if (files.indexOf('tiapp.xml') === -1) {
                            var directories = files.filter(function (file) {
                                return fs.statSync(path.join(currentFolder, file)).isDirectory();
                            });
                            if (directories.length === 0) { return null; }

                            /* Recursively look into all subfolder */
                            for (var i = 0, dir; dir = directories[i]; i++) {
                                tiappFolder = tiappFolder || 
                                    find_tiapp(path.join(currentFolder, dir)); 
                            }
                        } else { 
                            tiappFolder = currentFolder;
                        }

                        return tiappFolder;
                    }
                    

                    var gulpfile = path.join(options.root, 'project_files', 'gulpfile.js'),
                        dotgulp  = path.join(options.root, 'project_files', '.gulp'),
                        dest     = find_tiapp(options.processRoot);

                    /* If no tiapp has been found, we're likely to be on a widget/lib project.
                     * So there is no need to update gulpfiles are they are not on this branch
                     */
                    if (dest === null) { 
                        utils.log(utils.colors.yellow(
                            "No Titanium project found on 'master'; Skipping this step."));
                        return callback(); 
                    }
                        
                    /* Otherwise, update the branch */
                    exec("cp -r " + [gulpfile, dotgulp, dest].join(" "), function (err) {
                        if (err) { return callback(err); }
                        gitUtils.addAndCommit(dest, "Update boilerplate runner files", function (err) {
                            if (err) { return callback(err);}

                            utils.log(utils.colors.cyan("Branch 'master' updated! Yeay!"));
                            options.updated.push("master");
                            callback();
                        });
                    });
                });

            });

        },

        updateDocBranch: function (callback) {
            anyBranch("doc", function (branchExist) {
                if (!branchExist) { 
                    utils.log(utils.colors.yellow("No branch 'doc'; Skipping this step."));
                    return callback(); }
                
                git.checkout("doc", function (err) {
                    if (err) { return callback (); }
                    /* Test branch is supposed to be at the root of the project so... */    
                    var gulpfile = path.join(options.root, 'component_files', 'doc', 'gulpfile.js'),
                        dest     = options.processRoot;
                            
                    exec("cp -r " + [gulpfile, dest].join(" "), function (err) {
                        if (err) { return callback(err); }
                        gitUtils.addAndCommit(dest, "Update boilerplate runner files", function (err) {
                            if (err) { return callback(err); }

                            utils.log(utils.colors.cyan("Branch 'doc' updated! Yeay!"));
                            options.updated.push("doc");
                            callback();
                        });
                    });
                });

            });
        }
    };
};
