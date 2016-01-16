PATH := node_modules/.bin:$(PATH)
SHELL := /bin/bash

build: dist/presenter.min.js

dist/presenter.min.js: index.js
	uglifyjs vendor/* index.js -o dist/presenter.min.js

watch: index.js
	fswatch -o index.js | xargs -n1 -I{} make

clean:
	rm -rf dist/*

.PYHON: build watch clean
