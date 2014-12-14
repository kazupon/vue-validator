KARMA = node_modules/karma/bin/karma
SRCS = index.js sauce.js karma.conf.js webpack.conf.js task/ \
	   lib/*.js test/specs/*.js


dist: check node_modules
	@./task/dist

minify: check node_modules
	@./task/minify

check:
	@node_modules/.bin/jshint --config .jshintrc --exclude-path .jshintignore $(SRCS)

node_modules: package.json
	@npm install

test: check node_modules
	@$(KARMA) start

coverage:
	@VUE_VALIDATOR_TYPE=coverage $(MAKE) test

coveralls:
	@VUE_VALIDATOR_TYPE=coveralls $(MAKE) test

sauce1:
	@VUE_VALIDATOR_TYPE=sauce SAUCE=batch1 $(MAKE) test
	
sauce2:
	@VUE_VALIDATOR_TYPE=sauce SAUCE=batch2 $(MAKE) test

sauce3:
	@VUE_VALIDATOR_TYPE=sauce SAUCE=batch3 $(MAKE) test

sauce: sauce1 sauce2 sauce3

ci: coveralls sauce

clean:
	@rm -rf coverage
	@rm -rf dist


.PHONY: dist check test coverage node_modules clean
