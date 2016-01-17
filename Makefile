PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash

build: dist/presenter.min.js dist/presenter.min.css

dist/presenter.min.js: index.js vendor/*.js
ifeq ($(PRODUCTION), true)
	browserify index.js -o dist/presenter.min.js -t [ babelify --presets [ es2015 ] ] -p [ minifyify --no-map ]
else
	browserify index.js -o dist/presenter.min.js -t [ babelify --presets [ es2015 ] ] -d
endif

dist/presenter.min.css: index.css
	cp index.css dist/presenter.min.css

watch:
	fswatch -o index.js index.css vendor | xargs -n1 -I{} make

clean:
	rm -rf dist/*

.PYHON: build watch clean
