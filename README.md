##   CRUD API       ##

1. Install Node.js LTS version
2. Install NVM link: <a href="https://github.com/coreybutler/nvm-windows">Download</a>
3. Set your NodeJs version up to 24.14.0 or upper (nvm install 24.14.0 LTS and nvm use)
4. Fork this repository
5. Go to branch feat/crud-api
6. Install all dependencies: npm i
7. To run the app use scripts form package.json. Use command npm run ....
8. Deadline: 10/11/2025
9. Done date: 08/11/2025
10. Total score: 222/222

# Task: <a href="https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/assignment.md">CRUD API</a>
## Score: <a href="https://github.com/AlreadyBored/nodejs-assignments/blob/main/assignments/crud-api/score.md">CRUD API</a>

# Assignment: CRUD API

## Description

# Scoring: CRUD API

 ## Basic Scope
- [x] +10 The repository with the application contains a Readme.md file containing detailed instructions for installing, running and using the application
- [x] +10 GET api/users implemented properly
- [x] +10 GET api/users/{userId} implemented properly
- [x] +10 POST api/users implemented properly
- [x] +10 PUT api/users/{userId} implemented properly
- [x] +10 DELETE api/users/{userId} implemented properly
- [x] +6 Users are stored in the form described in the technical requirements
- [x] +6 Value of port on which application is running is stored in .env file
 ## Advanced Scope
- [x] +30 Task implemented on Typescript
- [x] +10 Processing of requests to non-existing endpoints implemented properly
- [x] +10 Errors on the server side that occur during the processing of a request should be handled and processed properly
- [x] +10 Development mode: npm script start:dev implemented properly
- [x] +10 Production mode: npm script start:prod implemented properly
 ## Hacker Scope
- [x] +30 There are tests for API (not less than 3 scenarios)
- [x] +50 There is horizontal scaling for application with a load balancer

## Forfeits

- **-95% of total task score** any external tools except `nodemon`, `dotenv`, `cross-env`, `typescript`, `ts-node`, `eslint` and its plugins, `webpack` and its plugins, `prettier`, `uuid`, `@types/*` as well as libraries used for testing
- **-30% of total task score** Commits after deadline (except commits that affect only Readme.md, .gitignore, etc.)
- **-20** Missing PR or its description is incorrect
- **-20** No separate development branch
- **-20** Less than 3 commits in the development branch, not including commits that make changes only to `Readme.md` or similar files (`tsconfig.json`, `.gitignore`, `.prettierrc.json`, etc.)
- **-5** The .env file is present in the repository (should be .env.example instead)
