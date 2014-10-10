C8 = ../node_modules/.bin/component

build: components index.js
	@$(C8) build

components: component.json
	@$(C8) install

clean:
	@rm -rf components
	@rm -rf build

open:
	@open index.html

.PHONY: clean
