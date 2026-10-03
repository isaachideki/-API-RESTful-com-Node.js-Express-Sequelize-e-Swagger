import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export const ESPECIES = ['cachorro', 'gato', 'outro'] as const;
export const PORTES = ['pequeno', 'medio', 'grande'] as const;

export type Especie = (typeof ESPECIES)[number];
export type Porte = (typeof PORTES)[number];

// Interface TypeScript que representa a entidade Pet
export interface PetAttributes {
  id: number;
  nome: string;
  especie: Especie;
  porte: Porte;
  idade_meses: number;
  peso_kg: number | null;
  descricao: string | null;
  adotado: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Campos que podem ser omitidos na criação (gerados pelo banco ou opcionais)
export type PetCreationAttributes = Optional<
  PetAttributes,
  'id' | 'peso_kg' | 'descricao' | 'adotado'
>;

export class Pet
  extends Model<PetAttributes, PetCreationAttributes>
  implements PetAttributes
{
  declare id: number;
  declare nome: string;
  declare especie: Especie;
  declare porte: Porte;
  declare idade_meses: number;
  declare peso_kg: number | null;
  declare descricao: string | null;
  declare adotado: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Pet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    especie: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    porte: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    idade_meses: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    peso_kg: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      // O PostgreSQL devolve DECIMAL como string; converte para número na resposta JSON
      get() {
        const valor = this.getDataValue('peso_kg');
        return valor === null || valor === undefined ? null : Number(valor);
      }
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    adotado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'pets',
    timestamps: true
  }
);
