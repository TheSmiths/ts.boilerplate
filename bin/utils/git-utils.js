var git = require('gulp-git'),
    gulp = require('gulp');

module.exports = {
    addAndCommit: function(files, msg, callback) {
        gulp.src(files).pipe(git.add());

        var checkIfCommited = function (nb, max) {
            if (nb > max) { return callback("Timeout; error during commit."); }
            git.status(function (err, stdout) {
                if (stdout.match(/nothing to commit/) !== null) { return callback(); }
                setTimeout(checkIfCommited, 1000 * 5, nb + 1, max);
            });
        };

        var checkIfAdded = function (nb, max) {
            if (nb > max) { return callback("Timeout; error during add."); }
            git.status(function (err, stdout) {
                if (stdout.match(/Untracked files/) === null) {
                    gulp.src(files).pipe(git.commit(msg));
                    setTimeout(checkIfCommited, 1000 * 5, 1, 5);
                } else {
                    setTimeout(checkIfAdded, 1000 * 5, nb + 1, max);
                }
            });   
        };
        
        setTimeout(checkIfAdded, 1000 * 5, 1, 5);
    }
};
