module.exports = function(grunt) {

    var noLive = grunt.option('noLive') || false;
    var liveReloadScript = (!noLive) ? "<script>document.write('<script src=\"http://" + getIP() + ":35729/livereload.js?snipver=1\"></' + 'script>')</script>" : "";

    grunt.initConfig({
        compass: {
            dev: {
                options: {
                    bundleExec: true,
                    sassDir: '_Build/sass',
                    cssDir: '_Output/css',
                    require: ['susy', 'normalize-scss', 'breakpoint'],
                    imagesDir: 'media/',
                    httpPath: './..',
                    relativeAssets: false
                }
            },
            dist: {
                options: {
                    bundleExec: true,
                    sassDir: '_Build/sass',
                    cssDir: '_Output/css',
                    require: ['susy', 'normalize-scss', 'breakpoint'],
                    environment: 'production',
                    imagesDir: 'media/',
                    httpPath: './..',
                    relativeAssets: false,
                    force: true
                }
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            dev: { // !! means this last, -- means loaded in body, __ means load in head, $$ means ignore completely
                files: [
                {
                    '_Output/js/crucial.js': ['_Build/js/**/__*.js', '_Build/js/**/!!__*.js', '!_Build/js/$$**/*.js', '!_Build/js/**/$$*.js'],
                    '_Output/js/script.js': ['_Build/js/**/--*.js', '_Build/js/**/!!--*.js', '!_Build/js/$$**/*.js', '!_Build/js/**/$$*.js']
                },
                {
                    expand: true,
                    cwd: '_Build/js/',
                    src: ['**/*.js', '!**/__*.js', '!**/--*.js', '!**/!!*.js', '!$$**/*.js', '!**/$$*.js'],
                    dest: '_Output/js/',
                    flatten: true
                }]
            },
            dist: {
                files: [
                {
                    '.tmp/js/crucial.js': ['_Build/js/**/__*.js', '_Build/js/**/!!__*.js'],
                    '.tmp/js/script.js': ['_Build/js/**/--*.js', '_Build/js/**/!!--*.js']
                },
                {
                    expand: true,
                    cwd: '_Build/js/',
                    src: ['**/*.js', '!**/__*.js', '!**/--*.js', '!**/!!*.js'],
                    dest: '.tmp/js/',
                    flatten: true
                }]
            }
        },
        uglify: {
            dist: {
                files: [
                {
                    '_Output/js/crucial.js': ['.tmp/js/crucial.js'],
                    '_Output/js/script.js': ['.tmp/js/script.js']
                },
                {
                    expand: true,
                    cwd: '.tmp/js',
                    src: ['**/*.js', '!crucial.js', '!script.js'],
                    dest: '_Output/js/',
                    flatten: true
                }]
            }
        },
        copy: {
            assets: {
                files: [{
                    expand: true,
                    cwd: '_Build/media/',
                    src: ['**/*'],
                    dest: '_Output/media/'
                }]
            },
            mediaElement: {
                files: [{
                    expand: true,
                    cwd: '_Build/mediaElement/',
                    src: ['**/*'],
                    dest: '_Output/build/'
                }]
            }
        },
        imagemin: {
            all: {
                files: [{
                    expand: true,
                    cwd: '_Build/media/',
                    src: ['**/*.{png,jpg,jpeg,gif}'],
                    dest: '_Build/media/'
                }]
            }
        },
        includereplace: {
            all: {
                options: {
                    prefix: '<!-- @@',
                    suffix: ' -->',
                    globals: {
                        Live_Reload: liveReloadScript,
                        Player_Index: ""
                    }
                },
                files: [{
                    expand: true,
                    cwd: '_Build/',
                    src: ['*.html', '!player.html'],
                    dest: '.tmp/includeReplaced/'
                }]
            }
        },
        'compile-handlebars': {
            all: {
                'files': [{
                    expand: true,
                    cwd: '.tmp/includeReplaced/',
                    src: ['*.html'],
                    dest: '.tmp/compiled/'
                }],
                'templateData': ['_Build/content.json'],
                //'globals': ['_Build/stamps.json'],
                'helpers': '_Build/handlebars/helpers/**/*.js',
                'partials': ['_Build/handlebars/partials/**/*.hbs', '_Build/handlebars/slides/**/*.hbs']
            }
        },
        htmlmin: {
            all: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                    keepClosingSlash: true
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/compiled',
                    src: '*.html',
                    dest: '_Output'
                }]
            }
        },
        jshint: {
            files: ['_Build/js/*.js', '!_Build/js/libs']
        },
        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['_Build/js/**/*.js'],
                tasks: ['jshint', 'concat:dev', 'clear', 'karma:unit:run'],
                options: {
                    spawn: false,
                }
            },
            styles: {
                files: ['_Build/sass/**/*.scss'],
                tasks: ['compass:dev', 'clear', 'karma:unit:run'],
                options: {
                    spawn: false,
                }
            },
            html: {
                files: ['_Build/*.html', '_Build/*.json', '_Build/*.xml', '_Build/handlebars/**/*'],
                tasks: ['copy', 'includereplace', 'compile-handlebars', 'htmlmin', 'clean', 'clear', 'karma:unit:run'],
                options: {
                    spawn: false,
                }
            },
            assets: {
                files: ['_Build/media/**/*'],
                tasks: ['copy:assets', 'clear', 'karma:unit:run'],
                options: {
                    spawn: false,
                }
            },
            icons: {
                files: ['_Build/icons/config.json'],
                tasks: ['fontello_svg', 'svgmin', 'svgfit', 'svgstore'],
                options: {
                    spawn: false,
                }
            },
            svgs: {
                files: ['_Build/icons/**/*.svg', '_Build/svg/**/*.svg'],
                tasks: ['svgmin', 'svgfit', 'svgstore'],
                options: {
                    spawn: false,
                }
            },
            tests: {
                files: ['_Test/**/*.js'],
                tasks: ['karma:unit:run'],
                options: {
                    spawn: false,
                }
            }
        },
        clean: {
            build: [".tmp"]
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                background: true,
                singleRun: false
            },
            continuous: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },
        fontello_svg: {
            default_options: {
                options: {
                    css: false,
                    skip: false,
                    fileFormat: '{1}.svg'
                },
                config: '_Build/icons/config.json',
                dest: '_Build/icons/'
            }
        },
        svgstore: {
            options: {
                prefix : 'icon-',
                inheritviewbox : true,
                svg: {
                    xmlns: 'http://www.w3.org/2000/svg'
                }
            },
            your_target: {
                files: {
                    '_Output/svg/svgSprite.svg' : ['.tmp/icons-fit/*.svg', '!.tmp/icons-fit/__*.svg']
                }
            }
        },
        svgmin: {
            dist: {
                options: { // __ means svg must be included with svg partial not icon partial. Gets embedded as inline svg not use
                    full: true,
                    plugins: [
                        {removeStyleElement: true},
                        {removeAttrs: {
                            attrs: ['fill', 'stroke', 'stroke-width', 'class']
                        }}
                    ]
                },
                files: [{
                    expand: true,
                    cwd: '_Build/icons/',
                    src: ['**/*.svg', '!**/__*.svg'],
                    dest: '.tmp/icons',
                    flatten: true
                },
                {
                    expand: true,
                    cwd: '_Build/svg/',
                    src: ['**/*.svg', '!**/__*.svg'],
                    dest: '.tmp/icons',
                    flatten: true
                }]
            },
            keepStyle: {
                files: [{
                    expand: true,
                    cwd: '_Build/svg/',
                    src: ['**/__*.svg'],
                    dest: '_Build/handlebars/partials/generated/svg/',
                    ext: '.hbs',
                    flatten: true,
                    rename: function(dest, src) {
                        return dest + 'icon-' + src;
                    }
                }]
            }
        },
        svgfit: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/icons',
                    src: '**/*.svg',
                    dest: '.tmp/icons-fit/',
                    flatten: true
                }]
            }
        }
    });

    grunt.registerTask('buildJs', 'Builds javascript switch statement so handlebar slides can be called from globalJS', function() {

        var contentJson = grunt.file.readJSON('_Build/content.json');

        var buildJs = 'function callSlideJS(name){\n';
        buildJs += '    switch(name){\n';

        for(var i = 0, len = contentJson.content.length; i < len; i++){
            buildJs += '        case "' + contentJson.content[i].name + '": {\n';
            buildJs += '            ' + contentJson.content[i].name + 'Func();\n';
            buildJs += '        }\n';
            buildJs += '        break;\n\n';
        }

        buildJs += '    }\n';
        buildJs += '}';

        grunt.file.write('_Build/js/generated/!!--slides.js', buildJs);
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['fontello_svg', 'svgmin', 'svgfit', 'svgstore', 'compass:dev', 'jshint', 'buildJs', 'concat:dev', 'copy', 'includereplace', 'compile-handlebars', 'htmlmin', 'clean', 'clear', 'karma:unit:start', 'watch']);
    grunt.registerTask('dist', ['fontello_svg', 'svgmin', 'svgfit', 'svgstore', 'imagemin', 'compass:dist', 'jshint', 'buildJs', 'concat:dist', 'uglify:dist', 'copy', 'includereplace', 'compile-handlebars', 'htmlmin', 'clean', 'karma:continuous', 'clear']);
};

function getIP () {
    var os = require('os');
    var ifaces = os.networkInterfaces();
    var storeIP = '';

    Object.keys(ifaces).forEach(function (ifname) {
      var alias = 0
        ;

      ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
          return;
        }

        if (alias >= 1) {
          // this single interface has multiple ipv4 addresses
          //console.log(ifname + ':' + alias, iface.address);
          storeIP = iface.address;
        } else {
          // this interface has only one ipv4 adress
          //console.log(ifname, iface.address);
          storeIP = iface.address;
        }
      });
    });

    return storeIP;
}

function getSassVariable(variable, sass) {
    var vars = sass.split('\n');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('//')[0].split(';')[0].split(':');
        if (pair[0].trim() === variable) {
            return pair[1].trim();
        }
    }
    console.log('Sass variable %s not found', variable);
}