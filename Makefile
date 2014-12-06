KARMA = node_modules/karma/bin/karma
SRCS = index.js karma.conf.js webpack.conf.js task/ \
	   lib/*.js test/specs/*.js


dist: check node_modules
	@./task/dist

minify: check node_modules
	@./task/minify

check:
	@node_modules/.bin/jshint --config .jshintrc --exclude-path .jshintignore $(SRCS)

node_modules: package.json
	@npm install

test:
	@$(KARMA) start --single-run

clean:
	@rm -rf coverage
	@rm -rf dist


.PHONY: dist check test node_modules clean
