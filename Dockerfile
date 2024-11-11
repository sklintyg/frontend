ARG from_image
FROM $from_image

ARG from_image
ARG project_name
ARG artifact
ARG artifact_name
ARG artifact_version
ARG application_path
ARG vcs_url
ARG vcs_ref

LABEL se.inera.from_image=${from_image}             \
      se.inera.project=${project_name}              \
      se.inera.artifact=${artifact}                 \
      se.inera.artifact_name=${artifact_name}       \
      se.inera.application_path=${application_path} \
      se.inera.version=${artifact_version}          \
      se.inera.vcs_url=${vcs_url}                   \
      se.inera.vcs_ref=${vcs_ref}

ENV APP_NAME=$artifact
ENV SCRIPT_DEBUG=true

# Replace default nginx static assets with built package.
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY /$application_path/dist/ .

# Copy nginx templates and nginx.conf
COPY /$application_path/nginx/templates /etc/nginx/templates/
COPY /$application_path/nginx/conf/nginx.conf /etc/nginx/nginx.conf

# Allow Nginx user access to specifed paths (101:101)

RUN  touch /var/run/nginx.pid && \
     chown -R nginx:nginx /var/cache/nginx /var/run/nginx.pid
USER nginx


EXPOSE 8080
