# README

This README would normally document whatever steps are necessary to get your application up and running.

### What is this repository for?

- Blog for https://fintrakk.com/
- 1.0

### How do I get set up?

- Summary of set up
- Configuration : .env files
- Dependencies: node.js, mongod
- Database configuration: .env
- Deployment instructions:
  edit the mongo settings in .env
  If a new install follow the steps: https://docs.mongodb.com/manual/tutorial/enable-authentication/

DB:
mongo
use fintrakk

on command line:
mongorestore --host localhost:27017 --gzip --db fintrakk ./db_seed/fintrakk

usage:
yarn install

npm i -g jake // if global install else in the project folder without -g flag

jake -f dist/main.js esSynchronize
yarn run dev
yarn run build-tasks

### Contribution guidelines

- Writing tests: TBD
- Code review: via PR
- Automated Tests: TBD

### Who do I talk to?

- Technical: Arpan Aggarwal<Arpan@enbake.com>
- Feedback: Harleen Kaur<harleen.ishu@gmail.com>
- Requirements/Strategy: Ishwinder Singh<singh.ishwinder@gmail.com>

Sample env:
const prod = process.env.NODE_ENV === 'production'

SITE_URI = prod ? 'fintrakk.com' : 'localhost:7000'
SITE_SCHEME = prod ? 'https' : 'http'
FULL_SITE_URI = `${SITE_SCHEME}://${SITE_URI}/`
API_URI = `${SITE_SCHEME}://${SITE_URI}/graphql`

S3_API_KEY = 'AKIAJLSNFS6JPIRVHAQA'
S3_SECRET_KEY = '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'

DB_USER='fintrakk'
DB_NAME='fintrakk'
DB_PASSWORD='0modnar9'

ELASTIC_HOST='http://localhost:9200'
ELASTIC_INDEX_ALIAS='softwares_alias'
