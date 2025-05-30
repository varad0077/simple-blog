pipeline {
    agent any

    environment {
        DOCKER_HOST_IP = "13.61.216.73"
        DOCKER_USER = "ubuntu"
        DOCKER_APP_DIR = "web-app"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/ullassam/devops.git'
            }
        }

        stage('Build Docker Image') {
    steps {
        withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'KEY')]) {
            sh """
                ssh -i \$KEY -o StrictHostKeyChecking=no ${DOCKER_USER}@${DOCKER_HOST_IP} '
                    rm -rf ${DOCKER_APP_DIR} && mkdir -p ${DOCKER_APP_DIR}
                '

                scp -i \$KEY -o StrictHostKeyChecking=no -r \
                    auth public \
                    Dockerfile package.json package-lock.json orders.json server.js users.json\
                    ${DOCKER_USER}@${DOCKER_HOST_IP}:${DOCKER_APP_DIR}/

                ssh -i \$KEY -o StrictHostKeyChecking=no ${DOCKER_USER}@${DOCKER_HOST_IP} '
                    cd ${DOCKER_APP_DIR} &&
                    docker build -t web-app .
                '
            """
        }
    }
}


        stage('Run Container') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'KEY')]) {
                    sh """
                        ssh -i \$KEY -o StrictHostKeyChecking=no ${DOCKER_USER}@${DOCKER_HOST_IP} '
                            docker rm -f web-container || true &&
                            docker run -d -p 3000:3000 --name web-container web-app
                        '
                    """
                }
            }
        }

        stage('Selenium Tests') {
            steps {
                sh """
                    echo "Running Selenium tests..."
                    # TODO: Add your Selenium test command here
                """
            }
        }
    }
}
