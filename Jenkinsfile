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

    stage('Publish Playwright Report to GitHub Pages') {
  when {
    expression { currentBuild.currentResult == 'SUCCESS' }
  }
  steps {
    withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
      sh '''
        PR_NUMBER=${CHANGE_ID}

        git config --global user.email "ci@jenkins"
        git config --global user.name "jenkins-ci"

        # clone init-ci2
        rm -rf gh-pages
        git clone https://${GITHUB_TOKEN}@github.com/boriratkk-boop/ci-selfhosted-demo.git \
          --branch gh-pages --single-branch gh-pages || \
        git clone https://${GITHUB_TOKEN}@github.com/boriratkk-boop/ci-selfhosted-demo.git gh-pages

        mkdir -p gh-pages/pr-${PR_NUMBER}
        cp -r playwright-report/* gh-pages/pr-${PR_NUMBER}/

        cd gh-pages
        git add .
        git commit -m "Publish Playwright report for PR-${PR_NUMBER}" || echo "no changes"
        git push origin gh-pages
      '''
    }
  }
}

stage('Comment Report URL to PR') {
  steps {
    withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
      sh '''
        PR_NUMBER=${CHANGE_ID}
        REPO="boriratkk-boop/ci-selfhosted-demo"
        REPORT_URL="https://boriratkk-boop.github.io/ci-selfhosted-demo/pr-${PR_NUMBER}/index.html"

        curl -s -X POST \
          -H "Authorization: token ${GITHUB_TOKEN}" \
          -H "Accept: application/vnd.github+json" \
          https://api.github.com/repos/${REPO}/issues/${PR_NUMBER}/comments \
          -d '{
            "body": "🧪 Playwright E2E Report\\n👉 '"${REPORT_URL}"'"
          }'
      '''
    }
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
