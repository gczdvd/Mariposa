describe('template spec', () => {
  it('login', () => {
    cy.visit('https://mariposachat.hu/login')

    cy.get('#email').type('csizmadiaxenia@gmail.com');
    // cy.get('#password').type('BarackoskerT');

    // cy.get('.primaryBTN').click()

    // cy.get('#chatArea').should(be.visible)
  })
})