'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('caminhoes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      placa: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(7)
      },
      marca: {
        allowNull: false,
        type: Sequelize.STRING(60)
      },
      modelo: {
        allowNull: false,
        type: Sequelize.STRING(80)
      },
      ano: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      capacidade_carga: {
        allowNull: false,
        type: Sequelize.DECIMAL(10, 2)
      },
      quilometragem: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      tipo_combustivel: {
        allowNull: false,
        type: Sequelize.ENUM('DIESEL', 'DIESEL_S10', 'DIESEL_S500')
      },
      status: {
        allowNull: false,
        defaultValue: 'ATIVO',
        type: Sequelize.ENUM('ATIVO', 'MANUTENCAO', 'INATIVO')
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('caminhoes');
  }
};
