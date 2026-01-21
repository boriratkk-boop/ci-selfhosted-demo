pipeline {
  agent any

  stages {

    stage('Detect Test Type from PR Label') {
  steps {
    script {
      withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {

        def response = sh(
          script: """
            curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
            https://api.github.com/repos/boriratkk-boop/ci-selfhosted-demo/issues/${CHANGE_ID}
          """,
          returnStdout: true
        )

        def pr = readJSON text: response
        def labels = pr.labels.collect { it.name }

        if (labels.contains('e2e:regression')) {
          env.TEST_TYPE = 'regression'
        } else if (labels.contains('e2e:full')) {
          env.TEST_TYPE = 'all'
        } else {
          env.TEST_TYPE = 'smoke'
        }

        echo "Detected TEST_TYPE = ${env.TEST_TYPE}"
        echo "RAW PR JSON:"
        echo response
      }
    }
  }
}

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
    script {
      env.E2E_RESULT = 'PASS'

      try {
        if (env.TEST_TYPE == 'smoke') {
          sh 'docker compose run qa npx playwright test --grep @smoke'
        } 
        else if (env.TEST_TYPE == 'regression') {
          sh 'docker compose run qa npx playwright test --grep @regression'
        } 
        else {
          sh 'docker compose run qa npx playwright test'
        }
      } catch (e) {
        env.E2E_RESULT = 'FAIL'
        currentBuild.result = 'FAILURE'
      }
    }
  }
}

    stage('Publish Playwright Report to GitHub Pages') {
  steps {
    withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
      sh '''
        PR_NUMBER=${CHANGE_ID}
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
        REPORT_URL="https://boriratkk-boop.github.io/ci-selfhosted-demo/pr-${PR_NUMBER}/index.html"

        if [ "${E2E_RESULT}" = "PASS" ]; then
          STATUS="✅ PASSED"
        else
          STATUS="❌ FAILED"
        fi

        curl -s -X POST \
          -H "Authorization: token ${GITHUB_TOKEN}" \
          -H "Accept: application/vnd.github+json" \
          https://api.github.com/repos/boriratkk-boop/ci-selfhosted-demo/issues/${PR_NUMBER}/comments \
          -d "{
            \\"body\\": \\"🧪 Playwright E2E ${STATUS}\\\\n👉 ${REPORT_URL}\\"
          }"
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
