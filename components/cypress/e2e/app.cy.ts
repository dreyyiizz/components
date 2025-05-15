describe('Full Application Test Suite', () => {
  describe('Main Page', () => {
    beforeEach(() => {
      cy.intercept('GET', 'http://localhost:4000/employee', {
        statusCode: 200,
        body: [
          { name: 'John Doe', salary: 50000, role: 'Developer' },
          { name: 'Jane Smith', salary: 60000, role: 'Manager' }
        ]
      }).as('getEmployees');

      cy.visit('/main');
    });

    it('should display the main page correctly', () => {
      cy.contains('Background Volume : 0%').should('be.visible');
      cy.contains('Increment!').should('be.visible');
      cy.contains('Decrement!').should('be.visible');
    });

    it('should increment and decrement the counter', () => {
      cy.contains('Background Volume : 0%').should('be.visible');

      cy.contains('Increment!').click();
      cy.contains('Background Volume : 5%').should('be.visible');

      cy.contains('Decrement!').click();
      cy.contains('Background Volume : 0%').should('be.visible');
    });

    it('should open and close the employee modal', () => {
      cy.contains('See Employees!').click();
      cy.contains('Employees :').should('be.visible');

      cy.contains('John Doe').should('be.visible');
      cy.contains('Jane Smith').should('be.visible');

      cy.get('button[aria-label="Close"]').click();
      cy.contains('Employees :').should('not.exist');
    });

    it('should navigate to student list page', () => {
      cy.contains('See Students!').click();
      cy.url().should('include', '/studentlist');
    });

    it('should navigate to todo list page', () => {
      cy.contains('See To Do List!').click();
      cy.url().should('include', '/todolist');
    });
  });

 
  describe('To-Do List Page', () => {
    beforeEach(() => {
      cy.intercept('GET', 'http://localhost:4000/todolist', {
        statusCode: 200,
        body: [
          {
            id: 1,
            title: 'Test Task',
            description: 'This is a test task',
            duedate: new Date(Date.now() + 86400000).toISOString(),
            completed: false
          }
        ]
      }).as('getTasks');

      cy.intercept('POST', '**/todolist', {
        statusCode: 201,
        body: {
          id: 2,
          title: 'New Task',
          description: 'New task description',
          duedate: new Date(Date.now() + 172800000).toISOString(),
          completed: false
        }
      }).as('addTask');

      cy.intercept('PATCH', '**/todolist/1/complete', {
        statusCode: 200,
        body: {
          id: 1,
          title: 'Test Task',
          description: 'This is a test task',
          duedate: new Date(Date.now() + 86400000).toISOString(),
          completed: true
        }
      }).as('completeTask');

      cy.intercept('DELETE', '**/todolist/1', {
        statusCode: 204
      }).as('deleteTask');

      cy.visit('/todolist');
    });

    it('should display the to-do list correctly', () => {
      cy.contains('To-Do List').should('be.visible');
      cy.contains('Test Task').should('be.visible');
    });

    it('should add a new task', () => {
      const futureDate = new Date(Date.now() + 86400000);
      const formattedDate = futureDate.toISOString().slice(0, 16);

      cy.get('input[placeholder="Enter task title"]').type('New Task');
      cy.get('input[placeholder="Enter task description"]').type('New task description');
      cy.get('input[type="datetime-local"]').type(formattedDate);
      cy.contains('Add').click();

      cy.contains('New Task').should('be.visible');
    });

    it('should complete a task', () => {
      cy.contains('Test Task').should('be.visible');
      cy.contains('Test Task').click();
      cy.contains('Test Task').should('have.class', 'line-through');
    });

    it('should delete a task', () => {
      cy.contains('Delete').click();
      cy.contains('Test Task').should('not.exist');
    });

    it('should switch task types', () => {
      cy.contains('basic Task').should('have.class', 'bg-green-600');
      cy.contains('timed Task').click();
      cy.contains('timed Task').should('have.class', 'bg-green-600');
    });
  });
});

describe('Student List Page', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/students', {
      statusCode: 200,
      body: [
        {
          id: 1,
          firstname: 'Alice',
          lastname: 'Johnson',
          groupname: 'Group A',
          role: 'Student',
          expectedsalary: 30000,
          expecteddateofdefense: '2023-12-15',
        },
      ],
    }).as('initialStudents')

    cy.visit('/studentlist')
    cy.wait('@initialStudents')
  })

  it('should display the student list correctly', () => {
    cy.contains('Students').should('be.visible')
    cy.contains('Johnson, Alice').should('be.visible')
    cy.contains('Group A').should('be.visible')
  })

  it('should add a new student', () => {
    cy.intercept('POST', '**/students', {
      statusCode: 201,
      body: {
        id: 2,
        firstname: 'Bob',
        lastname: 'Smith',
        groupname: 'Group B',
        role: 'Student',
        expectedsalary: 35000,
        expecteddateofdefense: '2023-12-20',
      },
    }).as('addStudent')

    cy.intercept('GET', '**/students', {
      statusCode: 200,
      body: [
        {
          id: 1,
          firstname: 'Alice',
          lastname: 'Johnson',
          groupname: 'Group A',
          role: 'Student',
          expectedsalary: 30000,
          expecteddateofdefense: '2023-12-15',
        },
        {
          id: 2,
          firstname: 'Bob',
          lastname: 'Smith',
          groupname: 'Group B',
          role: 'Student',
          expectedsalary: 35000,
          expecteddateofdefense: '2023-12-20',
        },
      ],
    }).as('getUpdatedStudents')

    cy.contains('+').click()

    cy.get('input[name="firstname"]').type('Bob')
    cy.get('input[name="lastname"]').type('Smith')
    cy.get('input[name="groupname"]').type('Group B')
    cy.get('input[name="role"]').type('Student')
    cy.get('input[name="expectedsalary"]').type('35000')
    cy.get('input[name="expecteddateofdefense"]').type('2023-12-20')

    cy.get('[data-testid="add-student-button"]').click()

    cy.wait('@addStudent')
    cy.wait('@getUpdatedStudents')

    cy.contains(/Smith.*Bob|Bob.*Smith/i).should('be.visible')
  })

  it('should sort students alphabetically', () => {
    cy.intercept('GET', '**/students', {
      statusCode: 200,
      body: [
        {
          id: 1,
          firstname: 'Alice',
          lastname: 'Johnson',
          groupname: 'Group A',
        },
        {
          id: 2,
          firstname: 'Bob',
          lastname: 'Adams',
          groupname: 'Group B',
        },
      ],
    }).as('getStudents')

    cy.visit('/studentlist')
    cy.wait('@getStudents')

    cy.get('select').should('exist').select('alphabetical')

    cy.get('.grid > div').first().should('contain.text', 'Adams, Bob')
  })

  it('should navigate back to main page', () => {
    cy.contains('Back').should('exist').click()
    cy.url().should('include', '/main')
  })
})