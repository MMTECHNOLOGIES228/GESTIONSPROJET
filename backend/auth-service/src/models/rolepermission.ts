'use strict';
import { Model, DataTypes, Sequelize, Optional, ModelAttributes } from 'sequelize';
import { RolePermissionAttributes } from '../interfaces/rolepermissionAttributes'; // Assuming RolePermissionAttributes interface is defined in a separate file




export default (sequelize: Sequelize) => {
    class RolePermission extends Model<RolePermissionAttributes> implements RolePermissionAttributes {
        public id!: string;
        public roleId!: string;
        public permId!: string;

        // timestamps!
        public readonly createdAt!: Date;
        public readonly updatedAt!: Date;
    };

    RolePermission.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        roleId: DataTypes.STRING,
        permId: DataTypes.STRING
    },
        {
            sequelize,
            modelName: 'RolePermission',
        });

    return RolePermission;
};
