C8 = node_modules/.bin/component
PONCHO = node_modules/.bin/poncho
REPORTER = dot
SRCS = $(shell find test/ -name "*.js")


build: check node_modules components index.js
	@$(C8) build --dev

check:
	@node_modules/.bin/jshint --config .jshintrc --exclude-path .jshintignore \
		index.js $(SRCS)

components: component.json
	@$(C8) install --dev -r https://raw.githubusercontent.com

node_modules: package.json
	@npm install

test: build
	@node_modules/.bin/mocha-phantomjs --reporter $(REPORTER) test/index.html

test_cov: build
	@$(PONCHO) test/index.html

test_coveralls: build
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@$(PONCHO) --reporter lcov test/index.html | node_modules/.bin/coveralls

clean:
	@rm -rf build


.PHONY: test test_cov test_coveralls lib_cov clean
