pipeline {
  agent any

  stages {
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
    success {
      echo '✅ CI PASSED'
    }
    failure {
      echo '❌ CI FAILED – block merge'
    }
  }
}
