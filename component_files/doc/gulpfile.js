var gulp = require('gulp'),
    exec = require('child_process').exec;

/* Generate documentation of the component */
gulp.task('default', ['doc']);
gulp.task('doc', function (done) {
    //var filesStream = gulp.src('!(node_modules|gulpfile|*.!(js))'),
    var filesStream = gulp.src(['*.js', '!gulpfile.js', './!(node_modules|documentation|*.*)']),
        files = [];

    filesStream.on('data', function (filename) {
        files.push(filename.path);
    });

    filesStream.on('finish', function () {
        exec('jsduck --config jsduck.json ' + files.join(' '), {maxBuffer: Infinity}, function (err) {
            if (err) { return done(err); }
            console.log('Doc generated in documentation/ '+
                '--- Use "git subtree push --prefix documentation origin gh-pages" to publish it');
            done();
        });
    });
});
