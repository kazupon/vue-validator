WEBPACK = webpack

build: node_modules index.js
	@$(WEBPACK) index.js build.js

node_modules: package.json
	@npm install

clean:
	@rm -rf node_modules
	@rm -rf build.js

open:
	@open index.html

.PHONY: clean
