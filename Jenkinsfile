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
                # backend env
                echo "$PORTFOLIO_BE_ENV" > back-end/.env

                # frontend env
                echo "$PORTFOLIO_FE_ENV" > front-end/.env

                # root env for docker-compose
                echo "$PORTFOLIO_BE_ENV" > .env
                '''
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh '''
                docker compose down
                docker compose up -d --build
                '''
            }
        }
    }
}
