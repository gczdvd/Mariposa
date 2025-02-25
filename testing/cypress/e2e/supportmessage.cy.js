describe('support message email fail spec', () => {
    it('should fail, email with no @ or .com at end', () => {
      cy.visit('https://mariposachat.hu/support')
  
      cy.get('#email').type('csizmadiaxeniagmail')
      cy.get('#fullname').type('xy')
      cy.get('#username').type('xy')
      cy.get('#message').type('xy')
  
      cy.get('button[class=primaryBTN]').click()
      cy.get('#emailFeedback').should('contain', 'Helytelen')
  
      cy.wait(2000)
    })
  })

  describe('support message fullname fail spec', () => {
    it('should fail, fullname is empty', () => {
      cy.visit('https://mariposachat.hu/support')
  
      cy.get('#email').type('csizmadiaxenia@gmail.com')
        //   cy.get('#fullname').type('xy')
      cy.get('#username').type('xy')
      cy.get('#message').type('xy')
  
      cy.get('button[class=primaryBTN]').click()
      cy.get('#nameFeedback').should('contain', 'Kérjük')
  
      cy.wait(2000)
    })
  })
  
  describe('support message message fail spec', () => {
    it('should fail, message is empty', () => {
      cy.visit('https://mariposachat.hu/support')
  
      cy.get('#email').type('csizmadiaxenia@gmail.com')
      cy.get('#fullname').type('xy')
      cy.get('#username').type('xy')
        //   cy.get('#message').type('')
  
      cy.get('button[class=primaryBTN]').click()
      cy.get('#messageFeedback').should('contain', 'Kérjük')
  
      cy.wait(2000)
    })
  })

  describe('support message all fail spec', () => {
    it('should fail, wrong email, no name, no message', () => {
      cy.visit('https://mariposachat.hu/support')
  
      cy.get('#email').type('csizmadiaxeniagmail')
  
      cy.get('button[class=primaryBTN]').click()
  
      cy.get('#emailFeedback').should('contain', 'Helytelen')
      cy.get('#nameFeedback').should('contain', 'Kérjük')
      cy.get('#messageFeedback').should('contain', 'Kérjük')

    })
  })
  
  describe('support message spec', () => {
    it('should be able to send', () => {
      cy.visit('https://mariposachat.hu/support')
  
      cy.get('#email').type('csizmadiaxenia@gmail.com')
      cy.get('#fullname').type('xy')
      cy.get('#username').type('xy')
      cy.get('#message').type('xy')
  
      cy.get('button[class=primaryBTN]').click()

      cy.get('#swal2-title').should('contain', 'Üzenet sikeresen elküldve!')
      
      cy.wait(2000)

      cy.get('.swal2-confirm').click();

      cy.get('#email').should('be.empty')
      cy.get('#fullname').should('be.empty')
      cy.get('#username').should('be.empty')
      cy.get('#message').should('be.empty')
    })
  })