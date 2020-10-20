module.exports = {
  apps: [{
    name: 'Fintrakk',
    script: 'server/devServer.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: '',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],

  deploy: {
    production: {
      'key': '~/.ssh/Techpikkpem.pem',
      user: 'ubuntu',
      host: '50.19.9.122',
      ref: 'origin/master',
      repo: 'git@bitbucket.org:ishwinder/fintrakk.git',
      path: '/home/bitnami/applications/fintrakk',
      'post-deploy': 'yarn && node_modules/.bin/next build && pm2 reload ecosystem.config.js --env production',
    },
  },
}
