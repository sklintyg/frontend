# Creates a s2i with yarn.

NAME=$(shell basename `pwd`)
TEMPLATE=../buildtemplate-image.yaml
PROCESS=oc process -f $(TEMPLATE) -p NAME=$(NAME) -p SOURCE="`cat Dockerfile`"

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

