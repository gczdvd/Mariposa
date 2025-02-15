describe('support message email fail spec', () => {
    it('should fail, email with no @ or .com at end', () => {
      cy.visit('https://mariposachat.hu/support')
  
      cy.get('#email').type('csizmadiaxeniagmail')
      cy.get('#fullname').type('xy')
      cy.get('#username').type('xy')
      cy.get('#message').type('xy')
  
      cy.get('button[class=primaryBTN]').click()
      cy.get('#emailFeedback').should('be.visible')
  
      cy.wait(2000)
    })
  })