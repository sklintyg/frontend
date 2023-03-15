describe('template spec', () => {
  it('Logga in som fristående', () => {
    cy.visit('/welcome')
    cy.get('[for="isFreestanding"]').click()
  })
})
