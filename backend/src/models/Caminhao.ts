import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from 'sequelize';

import { sequelize } from '../config/database';

export const tiposCombustivel = [
  'DIESEL',
  'DIESEL_S10',
  'DIESEL_S500',
] as const;

export const statusCaminhao = [
  'ATIVO',
  'MANUTENCAO',
  'INATIVO',
] as const;

export type TipoCombustivel = typeof tiposCombustivel[number];
export type StatusCaminhao = typeof statusCaminhao[number];

export class Caminhao extends Model<
  InferAttributes<Caminhao>,
  InferCreationAttributes<Caminhao>
> {
  declare id: CreationOptional<number>;

  declare placa: string;
  declare marca: string;
  declare modelo: string;
  declare ano: number;
  declare capacidadeCarga: number;
  declare quilometragem: number;
  declare tipoCombustivel: TipoCombustivel;

  declare status: CreationOptional<StatusCaminhao>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Caminhao.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    placa: {
      type: DataTypes.STRING(7),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [7, 7],
      },
    },

    marca: {
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 60],
      },
    },

    modelo: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 80],
      },
    },

    ano: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1950,
        max: 2100,
      },
    },

    capacidadeCarga: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'capacidade_carga',
      validate: {
        min: 0.1,
      },
    },

    quilometragem: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },

    tipoCombustivel: {
      type: DataTypes.ENUM(...tiposCombustivel),
      allowNull: false,
      field: 'tipo_combustivel',
    },

    status: {
      type: DataTypes.ENUM(...statusCaminhao),
      allowNull: false,
      defaultValue: 'ATIVO',
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
  },

  {
    sequelize,
    tableName: 'caminhoes',
    modelName: 'Caminhao',
    timestamps: true,
  },
);

export interface CaminhaoInput {
  placa: string;
  marca: string;
  modelo: string;
  ano: number;
  capacidadeCarga: number;
  quilometragem: number;
  tipoCombustivel: TipoCombustivel;
  status?: StatusCaminhao;
}