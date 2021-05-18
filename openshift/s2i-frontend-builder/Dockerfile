FROM node:12-alpine3.12

# Install required tools
RUN apk add --no-cache git python2 make g++ bash

# Set required labels
LABEL io.openshift.s2i.scripts-url="image:///usr/libexec/s2i" \
      io.s2i.scripts-url="image:///usr/libexec/s2i" \
      io.openshift.build.source-context-dir=/

# Default project UID
ARG X_UID=1001
ENV X_UID=${X_UID}

# Add custom S2I scripts
ADD s2i/bin/ /usr/libexec/s2i/
RUN chmod 777 -R /usr/libexec/s2i/

# S2I runs as user default, but when invoked by the testrunner pod another user (uid) is active (depends on openshift project settings)
# Setup permissions to enable an unknown user to access different locations used by gradle, npm, bower, chrome, ...
ARG X_DIRS="/tmp/artifacts /tmp/artifacts/build /tmp/artifacts/nginx /tmp/src /tmp/nohome /tmp/scripts"
RUN mkdir -p ${X_DIRS} && chown ${X_UID} ${X_DIRS} && chmod 777 ${X_DIRS}

# Run as user default for S2I, otheriwse another unspecified
USER ${X_UID}
