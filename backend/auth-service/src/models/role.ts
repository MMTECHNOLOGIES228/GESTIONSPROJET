'use strict';
import { Model, DataTypes,Optional, Sequelize } from 'sequelize';
import { RoleAttributes } from '../interfaces/roleAttributes';



export default (sequelize: Sequelize) => {
  class Role extends Model<RoleAttributes> implements RoleAttributes {
    public id!: string;
    public role_name!: string;
    public role_description!: string;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
  }


  Role.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      role_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      role_description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Role',
    }
  );
  return Role;
};


