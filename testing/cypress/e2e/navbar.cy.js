describe('landing page navbar navigation spec', () => {
    it('should be able to reach every page', () => {
      // Logó
      cy.visit('https://mariposachat.hu/')
      cy.get('.logo').click()
      cy.url().should('include', 'mariposachat.hu')
      cy.wait(2000)

      // Chatelj
      cy.get('#navigation > li:nth-child(1)').click()
      cy.url().should('include', '/login')
      cy.wait(2000)
      cy.go('back')

      // Rólunk
      cy.get('#navigation > li:nth-child(2)').click()
      cy.url().should('include', '/aboutus')
      cy.wait(2000)
      cy.go('back')

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

      // Hero section chatelj gomb
      cy.get('button[class=primaryBTN]').contains('CHATELJ!').click()
      cy.url().should('include', '/login')
      cy.wait(2000)
      cy.go('back')

      // Rólunk részleg gombja
      cy.get('button[class=secondaryBTN]').contains('RÓLUNK').click()
      cy.url().should('include', '/aboutus')
      cy.wait(2000)
      cy.go('back')

      // Regiszrációra felszólítás gombja
      cy.get('button[class=primaryBTN]').contains('REGISZTRÁCIÓ').click()
      cy.url().should('include', '/registration')
      cy.wait(2000)
      cy.go('back')

      // Támogatásra felszólítás gombja
      cy.get('button[class=secondaryBTN]').contains('TÁMOGATÁS').click()
      cy.url().should('include', 'buymeacoffee.com/mariposatsb')
      cy.wait(2000)
      cy.go('back')

      // Segítség kérése gomb
      cy.get('button[class=secondaryBTN]').contains('SEGÍTSÉG KÉRÉSE').click()
      cy.url().should('include', '/support')
      cy.wait(2000)
      cy.go('back')
    })
  })