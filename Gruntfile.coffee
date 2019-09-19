# vim: set ts=2 sw=2 sts=2 et:
module.exports = (grunt) ->
  version = '2.0.x/'

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    babel:
      options:
        sourceMap: false,
        presets: ['@babel/preset-env']

      dist:
        files:
          "2.0.x/pygal-tooltips.js": '.tmp/pygal-tooltips.js'

    uglify:
      options:
        banner: '/*! <%= pkg.name %>
           <%= grunt.template.today("yyyy-mm-dd") %> */\n'

      pygal:
        expand: true
        cwd: version
        src: ['*.js', '!*.min.js']
        dest: version
        ext: '.min.js'

    coffee:
      pygal:
        expand: true
        cwd: 'coffee'
        src: '*.coffee'
        dest: '.tmp'
        ext: '.js'

    coffeelint:
      ymci:
        'coffee/*.coffee'

    watch:
      options:
        livereload: true
      coffee:
        files: [
          'coffee/*.coffee'
          'Gruntfile.coffee'
        ]
        tasks: ['coffeelint', 'coffee']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-babel'

  grunt.registerTask 'dev', [
    'coffeelint', 'coffee', 'babel', 'watch']
  grunt.registerTask 'default', [
    'coffeelint', 'coffee', 'babel', 'uglify']
