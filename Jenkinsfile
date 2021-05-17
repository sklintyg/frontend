#!groovy

def artifactFolder = "target"
def applicationZip = "${artifactFolder}/${appReleaseName}-${BUILD_NUMBER}.tar.gz"

// run shell command, return status code
def shell(cmd) {
    sh(
            script: cmd,
            returnStatus: true
    )
}

// run shell command and signal an error on failure
def eshell(cmd) {
    def rc = shell(cmd)
    if (rc != 0) {
        error("Error: shell command exited with error code ${rc}")
    }
}

pipeline {
    agent any

    environment {

    }

    stages {

        stage('Checkout Source') {
            steps {
                script {
                    git url: "https://github.com/sklintyg/frontend.git", branch: "feature/INTYGFV-13885"
                }
            }
        }

        stage('Prepare source') {
            steps {
                script {
                    def applicationDir = "."
                    if (!fileExists("${artifactFolder}")) {
                        eshell("mkdir -p ${artifactFolder}")
                    }
                    eshell("tar --exclude ${artifactFolder} --exclude .git -chzf ${applicationZip} ${applicationDir}")
                    archiveArtifacts artifacts: "${applicationZip}", excludes: null, onlyIfSuccessful: true
                }
            }
        }

        stage('Setup Image Builds') {
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject() {
                            def models = openshift.process("-f", "openshift/buildtemplate-frontend.yaml",
                                    "-p", "IS_APP_NAME=webcert-frontend",
                                    "-p", "APP_NAME=webcert-frontend",
                                    "-p", "STAGE=test",
                                    "-p", "BUILD_VERSION=latest",
                                    "-p", "ARTIFACT_IMAGE_SUFFIX=artifact")
                            openshift.apply(models)
                        }
                    }
                }
            }
        }

        stage('Create Artifact Image') {
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject() {
                            log "Build artifact image webcert-frontend-artifact"
                            def build = openshift.selector("bc", "webcert-frontend-artifact").startBuild("--from-archive=${applicationZip}")
                            sleep(time: 1, unit: 'SECONDS')
                            log "${build.name()} started"
                            timeout(30) {
                                def status = ""
                                build.untilEach(1) {
                                    status = it.object().status.phase
                                    log "Build status: ${status}"
                                    return !["Running", "Pending", "New"].contains(status)
                                }
                                log "Logs for artifact build"
                                build.logs()
                                if (status != "Complete") {
                                    error("Build terminated with status: ${status}")
                                }
                                log "Build Completed"
                            }
                        }
                    }
                }
            }
        }

        stage('Create Runtime Image') {
            steps {
                script {
                    openshift.withCluster() {
                        openshift.withProject() {
                            log "Build runtime image webcert-frontend"
                            def build = openshift.selector("bc", "webcert-frontend-latest").startBuild()
                            sleep(time: 1, unit: 'SECONDS')
                            log "${build.name()} started"
                            timeout(45) {
                                def status = ""
                                build.untilEach(1) {
                                    status = it.object().status.phase
                                    log "Build status: ${status}"
                                    return !["Running", "Pending", "New"].contains(status)
                                }
                                log "Logs for docker runtime build"
                                build.logs()
                                if (status != "Complete") {
                                    error("Build terminated with status: ${status}")
                                }
                                log "Build Completed"
                            }
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            script {
                log "Pipeline success :)"
                util.notifySuccess()
            }
        }

        failure {
            script {
                log "Pipeline Failed :("
                util.notifyFailed()
            }
        }
    }
}
