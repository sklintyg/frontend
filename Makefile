# Creates build docker image for webcert-frontend

NAME=webcert-frontend
TEMPLATE=./openshift/buildtemplate-image.yaml
PROCESS=oc process -f $(TEMPLATE) -p NAME=$(NAME) -p SOURCE="`cat Dockerfile.webcert`"

all: build

# build image
build: apply
	oc start-build $(NAME) --from-dir=./ --follow

# apply config
apply:
	$(PROCESS) | oc $@ -f -

# delete config
delete:
	$(PROCESS) | oc $@ -f -

