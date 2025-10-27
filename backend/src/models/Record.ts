import { DataTypes, Model } from 'sequelize'
import { sequelize } from '../db'
import User from './User'

export interface RecordAttributes {
  id: number
  user_id: number
  start_time: Date
  end_time?: Date | null
  duration?: number | null
  created_at?: Date
  updated_at?: Date
}

class Record extends Model<RecordAttributes> implements RecordAttributes {
  public id!: number
  public user_id!: number
  public start_time!: Date
  public end_time!: Date | null
  public duration!: number | null
  public readonly created_at!: Date
  public readonly updated_at!: Date
}

Record.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: '持续时间（秒）',
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
    tableName: 'records',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
)

Record.belongsTo(User, { foreignKey: 'user_id', as: 'user' })
User.hasMany(Record, { foreignKey: 'user_id', as: 'records' })

export default Record
