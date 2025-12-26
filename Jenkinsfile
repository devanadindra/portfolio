pipeline {
    agent any

    options {
        disableConcurrentBuilds(abortPrevious: true)
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableResume()
    }

    environment {
        PORTFOLIO_BE_ENV = credentials('PORTFOLIO_BE_ENV')
        PORTFOLIO_FE_ENV = credentials('PORTFOLIO_FE_ENV')
    }

    stages {

        stage('Generate env files') {
            steps {
                sh '''
                printf "%s\n" "$PORTFOLIO_BE_ENV" > back-end/.env
                printf "%s\n" "$PORTFOLIO_FE_ENV" > front-end/.env
                printf "%s\n" "$PORTFOLIO_BE_ENV" > .env
                '''
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
