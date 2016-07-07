deploy:
	git push dokku

run:
	npm run start-dev

.PHONY: deploy run
