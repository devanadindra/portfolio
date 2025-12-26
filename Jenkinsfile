pipeline {
    agent any

    options {
        disableConcurrentBuilds(abortPrevious: true)
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableResume()
    }

    stages {

        stage('Generate env files') {
            steps {
                withCredentials([
                    file(credentialsId: 'PORTFOLIO_BE_ENV', variable: 'BE_ENV_FILE'),
                    file(credentialsId: 'PORTFOLIO_FE_ENV', variable: 'FE_ENV_FILE')
                ]) {
                    sh '''
                    set -e

                    mkdir -p back-end front-end

                    cp "$BE_ENV_FILE" back-end/.env
                    cp "$FE_ENV_FILE" front-end/.env
                    cp "$BE_ENV_FILE" .env
                    '''
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                docker compose --env-file .env down
                docker compose --env-file .env up -d --build
                '''
            }
        }
    }
}
