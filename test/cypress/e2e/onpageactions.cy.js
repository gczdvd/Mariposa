describe('landing page on-page actions spec', () => {
    it('should be able to reach every page', () => {
        cy.visit('https://mariposachat.hu/')

        // Hero section chatelj gomb
        cy.get('button[class=primaryBTN]').contains('CHATELJ!').click()
        cy.url().should('include', '/login')
        cy.wait(2000)
  
        // Rólunk részleg gombja
        cy.visit('https://mariposachat.hu/')
        cy.get('button[class=secondaryBTN]').contains('RÓLUNK').click()
        cy.url().should('include', '/aboutus')
        cy.wait(2000)
        cy.go('back')
  
        // Regiszrációra felszólítás gombja
        cy.get('button[class=primaryBTN]').contains('REGISZTRÁCIÓ').click()
        cy.url().should('include', '/registration')
        cy.wait(2000)
        cy.go('back')
  
        // Segítség kérése gomb
        cy.get('button[class=secondaryBTN]').contains('SEGÍTSÉG KÉRÉSE').click()
        cy.url().should('include', '/support')
        cy.wait(2000)
        cy.go('back')
      })
 })

 describe('about us page on-page actions spec', () => {
    it('should be able to reach every page', () => {
        cy.visit('https://mariposachat.hu/aboutus')

        // Hero section PRÓBÁLD KI gomb
        cy.get('button[class=primaryBTN]').contains('PRÓBÁLD KI!').click()
        cy.url().should('include', '/login')
        cy.wait(2000)
        cy.go('back')
        cy.go('back')
      })
 })

 describe('support page on-page actions spec', () => {
    it('should be able to reach every page', () => {
        cy.visit('https://mariposachat.hu/support')

        cy.get('.accordion').click({ multiple: true })
        cy.get('.accordion').invoke('attr', 'class').should('include', 'active')
      })
 })