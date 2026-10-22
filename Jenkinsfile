```groovy
pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'aayushijaju/expense-tracker:latest'
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/aayushijaju/Expense_tracker.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    export PATH="$HOME/.docker/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"

                    docker build -t $DOCKER_IMAGE .
                '''
            }
        }

        stage('Test Docker Image') {
            steps {
                sh '''
                    export PATH="$HOME/.docker/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"

                    docker image inspect $DOCKER_IMAGE
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )
                ]) {
                    sh '''
                        export PATH="$HOME/.docker/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"

                        echo "$DOCKER_PASS" | docker login \
                            -u "$DOCKER_USER" \
                            --password-stdin

                        docker push $DOCKER_IMAGE
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    export PATH="$HOME/.docker/bin:/usr/local/bin:/opt/homebrew/bin:$PATH"

                    kubectl apply -f deployment.yaml
                    kubectl apply -f service.yaml
                '''
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully! 🎉'
        }

        failure {
            echo 'Pipeline failed. Check the stage above for the error.'
        }
    }
}
```