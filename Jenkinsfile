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
      echo '📦 Publish Playwright Report'

      sh 'ls -la playwright-report || true'

      archiveArtifacts artifacts: 'playwright-report/**',
                       allowEmptyArchive: true

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

      withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
        sh '''
          PR_NUMBER=${CHANGE_ID}
          REPO="boriratkk-boop/ci-selfhosted-demo"
          REPORT_URL="https://boriratkk-boop.github.io/ci-selfhosted-demo/pr-${PR_NUMBER}/index.html"

          curl -s -X POST \
            -H "Authorization: token ${GITHUB_TOKEN}" \
            -H "Accept: application/vnd.github+json" \
            https://api.github.com/repos/${REPO}/issues/${PR_NUMBER}/comments \
            -d "{
              \\"body\\": \\"✅ CI PASSED\\n👉 ${REPORT_URL}\\"
            }"
        '''
      }
    }

    failure {
      echo '❌ CI FAILED – block merge'

      withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
        sh '''
          PR_NUMBER=${CHANGE_ID}
          REPO="boriratkk-boop/ci-selfhosted-demo"
          REPORT_URL="https://boriratkk-boop.github.io/ci-selfhosted-demo/pr-${PR_NUMBER}/index.html"

          curl -s -X POST \
            -H "Authorization: token ${GITHUB_TOKEN}" \
            -H "Accept: application/vnd.github+json" \
            https://api.github.com/repos/${REPO}/issues/${PR_NUMBER}/comments \
            -d "{
              \\"body\\": \\"❌ CI FAILED\\n📄 Playwright Report:\\n👉 ${REPORT_URL}\\"
            }"
        '''
      }
    }
  }
}
