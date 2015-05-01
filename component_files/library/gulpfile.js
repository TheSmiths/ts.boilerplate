var gulp = require('gulp'),
    exec = require('child_process').exec,
    path = require('path'),
    fs = require('fs');

gulp.task('test', function (done) {
    var testDir = path.join(process.cwd(), 'test');
        files = fs.readdirSync(process.cwd()).filter(function (el) {
            return el.match(/^(test|\.git|gulpfile.js|\.travis\.yml|node_modules)$/) === null;
        }),
        projectDir = path.join(testDir, fs.readdirSync(testDir).pop()),
        libDir = path.join(projectDir, 'app', 'lib');

    exec('cp -r ' + files.join(" ") + " " + libDir, function (err) {
        if (err) { process.exit(1); }
        
        process.chdir(projectDir);
        exec('gulp test:jasmine', done).stdout.pipe(process.stdout);
    });
});
