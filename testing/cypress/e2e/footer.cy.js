describe('landing page footer nav spec', () => {
    it('should be able to reach every page', () => {
      cy.visit('https://mariposachat.hu')
  
    //   BUY ME A COFFEE
      cy.get('#socialmedia>a:nth-child(1)').click()
      cy.url().should('include', 'https://buymeacoffee.com/mariposatsb')
      cy.go('back')

    //   INSTAGRAM
    //   cy.get('#socialmedia>a:nth-child(2)').click()
    //   cy.go('back')  

    // RÓLUNK
      cy.get('#team>a').click()
      cy.url().should('include', '/aboutus')
      cy.go('back')

    // SEGÍTSÉG
      cy.get('#customerservice>a').click()
      cy.url().should('include', '/support')
      cy.go('back')

    //   HÁZIREND
      cy.get('#more>a:nth-of-type(1)').click()
      cy.url().should('include', '/hazirend.pdf')
      cy.go('back')

    //   ÁSZF
      cy.get('#more>a:nth-of-type(2)').click()
      cy.url().should('include', '/mariposaaszf.pdf')
      cy.go('back')

    // KÉRDŐÍV
      cy.get('#more>a:nth-of-type(3)').click()
      cy.url().should('include', '/forms/')
      cy.go('back')

    //   DOKUMENTÁCIÓ
    //   cy.get('#more>a:nth-of-type(4)').click()
    //   cy.url().should('include', '/documentation')
    //   cy.go('back')
    })
  })

  describe('aboutus page footer nav spec', () => {
    it('should be able to reach every page', () => {
      cy.visit('https://mariposachat.hu/aboutus')
  
    //   BUY ME A COFFEE
      cy.get('#socialmedia>a:nth-child(1)').click()
      cy.url().should('include', 'https://buymeacoffee.com/mariposatsb')
      cy.go('back')

    //   INSTAGRAM
    //   cy.get('#socialmedia>a:nth-child(2)').click()
    //   cy.go('back')  

    // RÓLUNK
      cy.get('#team>a').click()
      cy.url().should('include', '/aboutus')
      cy.go('back')

    // SEGÍTSÉG
      cy.get('#customerservice>a').click()
      cy.url().should('include', '/support')
      cy.go('back')

    //   HÁZIREND
      cy.get('#more>a:nth-of-type(1)').click()
      cy.url().should('include', '/hazirend.pdf')
      cy.go('back')

    //   ÁSZF
      cy.get('#more>a:nth-of-type(2)').click()
      cy.url().should('include', '/mariposaaszf.pdf')
      cy.go('back')

    // KÉRDŐÍV
      cy.get('#more>a:nth-of-type(3)').click()
      cy.url().should('include', '/forms/')
      cy.go('back')

    //   DOKUMENTÁCIÓ
    //   cy.get('#more>a:nth-of-type(4)').click()
    //   cy.url().should('include', '/documentation')
    //   cy.go('back')
    })
  })

  describe('support page footer nav spec', () => {
    it('should be able to reach every page', () => {
      cy.visit('https://mariposachat.hu/support')
  
    //   BUY ME A COFFEE
      cy.get('#socialmedia>a:nth-child(1)').click()
      cy.url().should('include', 'https://buymeacoffee.com/mariposatsb')
      cy.go('back')

    //   INSTAGRAM
    //   cy.get('#socialmedia>a:nth-child(2)').click()
    //   cy.go('back')  

    // RÓLUNK
      cy.get('#team>a').click()
      cy.url().should('include', '/aboutus')
      cy.go('back')

    // SEGÍTSÉG
      cy.get('#customerservice>a').click()
      cy.url().should('include', '/support')
      cy.go('back')

    //   HÁZIREND
      cy.get('#more>a:nth-of-type(1)').click()
      cy.url().should('include', '/hazirend.pdf')
      cy.go('back')

    //   ÁSZF
      cy.get('#more>a:nth-of-type(2)').click()
      cy.url().should('include', '/mariposaaszf.pdf')
      cy.go('back')

    // KÉRDŐÍV
      cy.get('#more>a:nth-of-type(3)').click()
      cy.url().should('include', '/forms/')
      cy.go('back')

    //   DOKUMENTÁCIÓ
    //   cy.get('#more>a:nth-of-type(4)').click()
    //   cy.url().should('include', '/documentation')
    //   cy.go('back')
    })
  })

  