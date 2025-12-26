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
                    string(credentialsId: 'PORTFOLIO_FE_ENV', variable: 'FE_ENV_TEXT')
                ]) {
                    sh '''
                    set -e

                    mkdir -p back-end front-end

                    # BE pakai secret FILE
                    cp "$BE_ENV_FILE" back-end/.env
                    cp "$BE_ENV_FILE" .env

                    # FE pakai secret TEXT
                    printf "%s" "$FE_ENV_TEXT" > front-end/.env
                    '''
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                docker compose --env-file .env up -d --build
                '''
            }
        }
    }
}
