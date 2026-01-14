pipeline {
  agent { label 'self-hosted' }

  stages {

    stage('Backend') {
      steps {
        dir('backend') {
          sh 'npm install'
          sh 'nohup node server.js &'
        }
      }
    }

    stage('Frontend') {
      steps {
        dir('frontend') {
          sh 'npm install'
          sh 'nohup npm start &'
        }
      }
    }

    stage('QA Automation') {
      steps {
        dir('qa') {
          sh 'npm install'
          sh 'npx playwright test'
        }
      }
    }
  }
}
