# Openshift

[Openshift](https://www.redhat.com/en/technologies/cloud-computing/openshift) is a cloud application platform powered by Kubernetes and our frontend-applications are built using a OpenShift build pipeline.

## Build Pipeline

The OpenShift-template for creating the pipeline can be found in `pipelinetemplate-build-frontend.yaml`.

The pipeline is partially prepared for building other frontend applications within the frontend-repo.

**Parameters:**

| Parameter             | Required | Description                                                           |
| --------------------- | -------- | --------------------------------------------------------------------- |
| APP_NAME              | Yes      | The Web App name, ex: `webcert-frontend`                              |
| RELEASE_VERSION       | Yes      | The name of this release, ex: `2021-2`                                |
| STAGE                 |          | The stage label, default is `test`                                    |
| ARTIFACT_IMAGE_SUFFIX |          | The suffix of the artifact ImageStream, default is `artifact`         |
| GIT_URL               | Yes      | URL to git repository, ex: `https://github.com/sklintyg/frontend.git` |
| GIT_CI_BRANCH         | Yes      | Branch in git repository, ex: `master`                                |

To create a frontend-pipeline using the template, you make sure to first login to OpenShift and then run the following command.

```
`oc process -f pipelinetemplate-build-frontend.yaml -p APP_NAME=webcert-frontend -p RELEASE_VERSION=2021-2 -p GIT_URL=https://github.com/sklintyg/frontend.git -p GIT_CI_BRANCH=master | oc apply  -f -`
```
