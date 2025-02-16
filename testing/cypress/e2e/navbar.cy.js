describe('landing page navbar navigation spec', () => {
    it('should be able to reach every page', () => {
      cy.visit('https://mariposachat.hu/')
  
      cy.get('#logo').click()

      cy.url().should('include', 'mariposachat.hu')

      cy.wait(2000)

      cy.get('#navigation>a:nth-child(2)').click()

      cy.url().should('include', 'mariposachat.hu')

      
  
      cy.get('button[class=primaryBTN]').click()
  
      cy.url().should('include', '/chat')
      
      cy.wait(2000)
    })
  })