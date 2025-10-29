'use strict';
import { Model, DataTypes, Sequelize, Optional, ModelAttributes } from 'sequelize';
import { PermissionAttributes } from '../interfaces/permissionAttributes'; // Assuming PermissionAttributes interface is defined in a separate file

export interface PermissionCreationAttributes extends Optional<PermissionAttributes, 'id'> { }

export default (sequelize: Sequelize) => {
    class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> implements PermissionAttributes {
        public id!: string;
        public perm_name!: string;
        public perm_description!: string;

        // timestamps!
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    };

    Permission.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            perm_name: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false
            },
            perm_description: {
                type: DataTypes.STRING,
                allowNull: false
            },
        },
        {
            sequelize,
            modelName: 'Permission',
        });

    return Permission;
};
