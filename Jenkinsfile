
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/aayushijaju/Expense_tracker.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t aayushijaju/expense-tracker:latest .'
            }
        }

        stage('Test Docker Image') {
            steps {
                sh 'docker image inspect aayushijaju/expense-tracker:latest'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                        docker push aayushijaju/expense-tracker:latest
                        docker logout
                    '''
                }
            }
        }

        
stage('Deploy to Kubernetes') {
    steps {
        sh '''
            export KUBECONFIG=/var/lib/jenkins/.kube/config
            kubectl apply -f k8s/
            kubectl rollout restart deployment/expense-tracker
            kubectl rollout status deployment/expense-tracker --timeout=120s
        '''
    }
}

        }
    }

