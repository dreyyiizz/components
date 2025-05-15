For components 
- cd components (for frontend) ->  npm i -> npm run dev
- cd backend -> npm i -> npm run dev

For testing 
- cd backend
- go to backend\src\__tests__\student.test.ts to see the testing file
- fake data can be seen under backend\src\globals\fakeData.ts
- run npm test
- .env is already provided!

For End to End testing (Cypress)
- npm i
- cd components (frontend)
- npm run dev 
- npx cypress open (new terminal)
- test file can be seen here components\cypress\e2e\app.cy.ts