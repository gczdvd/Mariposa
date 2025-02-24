describe('login email fail spec', () => {
  it('should fail, email with no @ or .com at end', () => {
    cy.visit('https://mariposachat.hu/login')

    cy.get('#email').type('csizmadiaxeniagmail')
    cy.get('#password').type('UserPassword')

    cy.get('button[class=primaryBTN]').click()
    cy.get('#emailFeedback').should('be.visible')

    cy.wait(2000)
  })
})

describe('login password fail spec', () => {
  it('should fail, password with no capital chars', () => {
    cy.visit('https://mariposachat.hu/login')

    cy.get('#email').type('csizmadiaxenia@gmail.com')
    cy.get('#password').type('userpassword')

    cy.get('button[class=primaryBTN]').click()
    cy.get('#pswFeedback').should('be.visible')

    cy.wait(2000)
  })
})

describe('login fail spec', () => {
  it('should fail, incorrect email and password', () => {
    cy.visit('https://mariposachat.hu/login')

    cy.get('#email').type('csizmadiaxeniagmail')
    cy.get('#password').type('userpassword')

    cy.get('button[class=primaryBTN]').click()

    cy.get('#emailFeedback').should('be.visible')
    cy.get('#pswFeedback').should('be.visible')

  })
})

describe('login spec', () => {
  it('should be able to login', () => {
    cy.visit('https://mariposachat.hu/login')

    cy.get('#email').type('csizmadiaxenia@gmail.com')
    cy.get('#password').type('UserPassword')

    cy.get('button[class=primaryBTN]').click()

    cy.url().should('include', '/chat')
    
    cy.wait(2000)
  })
})