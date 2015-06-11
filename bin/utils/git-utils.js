var git = require('gulp-git'),
    gulp = require('gulp');

/* Extend a bit functionnality of the gulp-git module. We want add and commit to be made
 * synchronously, the first one after the latter. */
module.exports = {
    /* 
     * @method addAndCommit
     * Add and commit given files to the current upstream
     * @param {Array<string>} files The list of files / folders to add using a node-glob syntax
     * @param {string} msg The message of the commit
     * @param {Object} [options] Some options that might be supplied to gulp-git
     * @param {Function} callback The callback to execute at then end or to handle an error.
     */
    addAndCommit: function(files, msg, options, callback) {
        /* Options are.. optionnal */
        if (callback === undefined) { 
          callback = options; 
          options = undefined;
        }

        /* Add options to gulp-git if any, and add files */
        var addArgs = options && {args: options} || undefined;
        gulp.src(files).pipe(git.add(addArgs));

        /* Use to check if files have been commited. Failed after nb temptative */
        setTimeout(module.exports.checkIfAdded, 1000 * 5, 1, 5, function () {
            /* Use to check if files have been added. Failed after nb temptative */
            git.status({maxBuffer: Infinity}, function (err, stdout) {
                if (stdout.match(/nothing to commit/)) { return callback(); }

                gulp.src(files).pipe(git.commit(msg, {maxBuffer: Infinity}));
                setTimeout(module.exports.checkIfCommited, 1000 * 5, 1, 5, callback);
            });
        });
    },

    /*
     * @method checkIfCommited 
     * Ensure that there is no pending or untracked files in the branch
     * @param nb The nbth try to read the git status
     * @param max Number of try before assuming it's failed
     * @param callback The callback to call on error or success.
     */
    checkIfCommited: function self (nb, max, callback) {
        git.status({maxBuffer: Infinity}, function (err, stdout) {
            /* We consider git-status output to do so*/
            if (stdout.match(/nothing to commit/) !== null) { return callback(); }
            if (++nb > max) { return callback("Timeout; error during commit."); }
            setTimeout(self, 1000 * 5, nb, max, callback);
        });
    },

    /* 
     * @method checkIfAdded
     * @see checkIfCommited and do a little of abstraction with your mind.
     */
    checkIfAdded: function self (nb, max, callback) {
        git.status({maxBuffer: Infinity}, function (err, stdout) {
            if (stdout.match(/Untracked files/) === null) { return callback(); }
            if (++nb > max) { return callback("Timeout; error during add."); }
            setTimeout(self, 1000 * 5, nb, max, callback);
        });   
    }
};
