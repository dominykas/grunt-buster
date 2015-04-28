module.exports = function (grunt) {

  var resolveBin = require('resolve-bin'),
    cp = require('child_process');

  grunt.registerTask('buster-static', function () {
    var done = this.async();

    resolveBin('buster', {executable: 'buster-static'}, function (e, busterStaticBinPath) {
      if (e) {
        grunt.fail.fatal(e);
        return;
      }

      var options = {
        //port: 8000,
        //config: 'test/buster.js'
      };

      var busterStaticCmd = [
        busterStaticBinPath
      ];
      Object.keys(options).forEach(function (k) {
        busterStaticCmd.push('--' + k);
        busterStaticCmd.push(options[k]);
      });

      grunt.log.writeln('Spawning buster-static: ' + busterStaticCmd.join(' '));
      var busterStaticProcess = cp.spawn(process.execPath, busterStaticCmd, {
        env: process.env,
        setsid: true
      });

      process.on('exit', function () {
        busterStaticProcess.kill();
      });

      busterStaticProcess.stderr.on('data', function (data) {
        grunt.fail.fatal(data);
      });
      busterStaticProcess.stdout.once('data', function () {
        done();
      });

    });

  });

};
