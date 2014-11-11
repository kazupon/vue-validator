WEBPACK = node_modules/.bin/webpack
KARMA = node_modules/karma/bin/karma
SRCS = $(shell find test/ -name "*.js")


dist: check node_modules index.js
	@$(WEBPACK) index.js dist/vue-validator.js

check:
	@node_modules/.bin/jshint --config .jshintrc --exclude-path .jshintignore \
		index.js $(SRCS)

node_modules: package.json
	@npm install

test:
	@$(KARMA) start --single-run

clean:
	@rm -rf coverage
	@rm -rf dist


.PHONY: dist check test node_modules clean
