import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { IOrganization, IOrganizationCreate } from '../interfaces/organization.interface';

type OrganizationCreationAttributes = Optional<IOrganizationCreate, 'description' | 'settings'>;

class Organization extends Model<IOrganization, OrganizationCreationAttributes> implements IOrganization {
    public id!: string;
    public name!: string;
    public slug!: string;
    public description!: string;
    public owner_id!: string;
    public settings!: IOrganization['settings'];
    public created_at!: Date;
    public updated_at!: Date;
}

export default function (sequelize: Sequelize): typeof Organization {
    Organization.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 255]
                }
            },
            slug: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                    is: /^[a-z0-9-]+$/ // Only lowercase, numbers and hyphens
                }
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            owner_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            settings: {
                type: DataTypes.JSONB,
                allowNull: false,
                defaultValue: {
                    theme: 'light',
                    language: 'en',
                    timezone: 'UTC',
                    allow_registration: false,
                    max_projects: 10,
                    max_members: 50
                }
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            }
        },
        {
            sequelize,
            modelName: 'Organization',
        }
    );

    return Organization;
}