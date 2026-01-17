pipeline {
  agent any

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build & Test (Base Test)') {
      steps {
        sh '''
          docker compose down -v || true
          docker compose up --build --abort-on-container-exit
        '''
      }
    }
  }

  post {
    always {
      sh 'docker compose down -v || true'
    }

    failure {
      echo '❌ CI FAILED – block merge'
    }

    success {
      echo '✅ CI PASSED – ready for deploy'
    }
  }
}
