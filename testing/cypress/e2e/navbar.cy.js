describe('landing page navbar navigation spec', () => {
    it('should be able to reach every page', () => {
      // Logó
      cy.visit('https://mariposachat.hu/')
      cy.get('.logo').click()
      cy.url().should('include', 'mariposachat.hu')

      // Chatelj
      cy.get('#navigation > li:nth-child(1)').click()
      cy.url().should('include', '/login')

      // Rólunk
      cy.visit('https://mariposachat.hu/')
      cy.get('#navigation > li:nth-child(2)').click()
      cy.url().should('include', '/aboutus')
      cy.go('back')

      // Segítség
      cy.get('#navigation > li:nth-child(3)').click()
      cy.url().should('include', '/support')
      cy.go('back')
  
      // Bejelentkezés
      cy.get('[id="loginNav"] > li').click()
      cy.url().should('include', '/login')
      cy.go('back')
    })
  })

  describe('about us page navbar navigation spec', () => {
    it('should be able to reach every page', () => {
      cy.visit('https://mariposachat.hu/aboutus')

      // Logó
      cy.get('.logo').click()
      cy.url().should('include', 'mariposachat.hu')
      cy.wait(2000)
      cy.go('back')

      // Chatelj
      // cy.get('#navigation > li:nth-child(1)').click()
      // cy.url().should('include', '/login')
      // cy.wait(2000)

      // Rólunk
      cy.visit('https://mariposachat.hu/aboutus')
      cy.get('#navigation > li:nth-child(2)').click()
      cy.url().should('include', '/aboutus')
      cy.wait(2000)

      // Segítség
      cy.get('#navigation > li:nth-child(3)').click()
      cy.url().should('include', '/support')
      cy.wait(2000)
      cy.go('back')
  
      // Bejelentkezés
      cy.get('[id="loginNav"] > li').click()
      cy.url().should('include', '/login')
      cy.wait(2000)
      cy.go('back')
    })
  })

  describe('support page navbar navigation spec', () => {
    it('should be able to reach every page', () => {
      cy.visit('https://mariposachat.hu/support')

      // Logó
      cy.get('.logo').click()
      cy.url().should('include', 'mariposachat.hu')
      cy.wait(2000)
      cy.go('back')

      // Chatelj
      cy.get('#navigation > li:nth-child(1)').click()
      cy.url().should('include', '/login')
      cy.wait(2000)

      // Rólunk
      cy.visit('https://mariposachat.hu/support')
      cy.get('#navigation > li:nth-child(2)').click()
      cy.url().should('include', '/aboutus')
      cy.wait(2000)
      cy.go('back')

      // Segítség
      cy.get('#navigation > li:nth-child(3)').click()
      cy.url().should('include', '/support')
      cy.wait(2000)
  
      // Bejelentkezés
      cy.get('[id="loginNav"] > li').click()
      cy.url().should('include', '/login')
      cy.wait(2000)
      cy.go('back')
    })
  })

  // chat és profile settings oldalon is van navbar, de ott előbb be kell jelentkezni