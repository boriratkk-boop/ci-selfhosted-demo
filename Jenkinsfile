pipeline {
  agent any

  environment {
    GITHUB_TOKEN = credentials('github-token')
  }

  stages {

    stage('Start Backend') {
      steps {
        dir('backend') {
          sh 'npm install'
          sh 'nohup node server.js &'
        }
      }
    }

    stage('Wait Backend Ready') {
      steps {
        sh '''
        until curl -s http://localhost:3001/health | grep ok
        do
          echo "Waiting for backend..."
          sleep 2
        done
        '''
      }
    }

    stage('Start Frontend') {
      steps {
        dir('frontend') {
          sh 'npm install'
          sh 'nohup npm start &'
        }
      }
    }

    stage('Wait Frontend Ready') {
      steps {
        sh '''
        until curl -s http://localhost:3000
        do
          echo "Waiting for frontend..."
          sleep 2
        done
        '''
      }
    }

      stage('QA Automation') {
    steps {
      dir('qa') {
        sh 'npm install'
        sh 'npx playwright install --with-deps'
        sh 'npx playwright test'   // ถ้า fail → exit 1 → Jenkins FAIL
      }
    }
  }
  }

  post {
    success {
      githubNotify context: 'jenkins/qa',
                   description: 'Tests passed',
                   status: 'SUCCESS'
    }
    failure {
      githubNotify context: 'jenkins/qa',
                   description: 'Tests failed',
                   status: 'FAILURE'
    }
  }
}
