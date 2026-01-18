pipeline {
  agent any

  stages {

    stage('Cleanup (Before)') {
      steps {
        sh 'docker compose down -v || true'
      }
    }

    stage('Build Images') {
      steps {
        sh 'docker compose build --no-cache'
      }
    }

    stage('Start Services') {
      steps {
        sh 'docker compose up -d db backend frontend'
      }
    }

    stage('Run E2E Tests (Playwright)') {
      steps {
        sh 'docker compose run qa npx playwright test'
      }
    }
  }

  post {

    always {
      sh 'docker compose down -v || true'

      archiveArtifacts artifacts: 'playwright-report/**',
                       allowEmptyArchive: true

      sh 'ls -la playwright-report || echo "no report"'

      publishHTML(target: [
        reportDir: 'playwright-report',
        reportFiles: 'index.html',
        reportName: 'Playwright E2E Report',
        keepAll: true,
        alwaysLinkToLastBuild: true,
        allowMissing: true
      ])
    }

    success {
      echo '✅ CI PASSED – allow merge'
    }

    failure {
      echo '❌ CI FAILED – block merge'
    }
  }
}
