import { Sequelize } from 'sequelize'

const sequelize = new Sequelize(
  process.env.DATABASE_URL || 'postgresql://niuzi:niuzi123@database:5432/niuzi_db',
  {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
)

export { sequelize }
