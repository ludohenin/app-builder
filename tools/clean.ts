import * as del from 'del';

del(['!node_modules',
     '!node_modules/**/*',
     'src/**/*.js',
     'src/**/*.js.map',
     'spec/**/*.js',
     'spec/**/*.js.map',
     'tools/**/*.js',
     'tools/**/*.js.map',
     'example/**/*.js',
     'example/**/*.js.map',
     'app-buildr.js',
     'app-buildr.js.map'],
     () => console.log('done!'));
