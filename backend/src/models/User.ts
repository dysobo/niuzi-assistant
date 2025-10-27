import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db'

export interface UserAttributes {
  id: number
  username: string
  password_hash: string
  created_at?: Date
  updated_at?: Date
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number
  public username!: string
  public password_hash!: string
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

export default User
