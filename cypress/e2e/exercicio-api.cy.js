/// <reference types="cypress" />
import contratos from '../contracts/usuarios.contract'


describe('Testes da Funcionalidade Usuários', () => {

  it('Deve validar contrato de usuários', () => {
    cy.request('usuarios').then(Response => {
      return contratos.validateAsync(Response.body)
    })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios'
    }).should((Response) => {
      expect(Response.body).to.have.property('usuarios')
      expect(Response.status).equal(200)
    })
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    let email = 'testeqa' + Math.floor(Math.random() * 100000) + '@teste.com.br'
    cy.cadastrarUsuario('Engenheiro de software', email, 'teste@123', 'true')
      .should((response) => {
        expect(response.status).equal(201)
        expect(response.body.message).equal('Cadastro realizado com sucesso')
      })
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.cadastrarUsuario('Engenheiro de software', 'testeqa6551@teste.com.br', 'teste@123', 'true')
      .should((response) => {
        expect(response.status).equal(400)
        expect(response.body.message).equal('Este email já está sendo usado')
      })
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let email = 'testeqa' + Math.floor(Math.random() * 100000) + '@teste.com.br'
    cy.cadastrarUsuario('Engenheiro de software', email, 'teste@123', 'true')
      .then(response => {
        let id = response.body._id

        cy.request({
          method: 'PUT',
          url: `usuarios/${id}`,
          body:
          {
            "nome": "Usuário edit",
            "email": email,
            "password": "teste@123",
            "administrador": "true"
          }
        }).then(response => {
          expect(response.body.message).to.equal('Registro alterado com sucesso')
        })
      })
  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    let email = 'testeqa' + Math.floor(Math.random() * 100000) + '@teste.com.br'
    cy.cadastrarUsuario('Engenheiro de software', email, 'teste@123', 'true')
      .then(response => {
        let id = response.body._id
        cy.request({
          method: 'DELETE',
          url: `usuarios/${id}`,
        }).then(response => {
          expect(response.body.message).to.equal('Registro excluído com sucesso')
          expect(response.status).to.equal(200)
        })
      })
  });
});
