import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { IProject, IProjectCreate, ProjectStatus } from '../interfaces/project.interface';

type ProjectCreationAttributes = Optional<IProjectCreate, 'description' | 'status' | 'start_date' | 'end_date' | 'budget' | 'settings' | 'tags'>;

class Project extends Model<IProject, ProjectCreationAttributes> implements IProject {
    public id!: string;
    public organization_id!: string;
    public name!: string;
    public description!: string;
    public status!: ProjectStatus;
    public start_date!: Date;
    public end_date!: Date;
    public budget!: number;
    public progress!: number;
    public settings!: IProject['settings'];
    public tags!: string[];
    public created_by!: string;
    public created_at!: Date;
    public updated_at!: Date;
}

export default function (sequelize: Sequelize): typeof Project {
    Project.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            organization_id: {
                type: DataTypes.UUID,
                allowNull: false,
                onDelete: 'CASCADE'
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [2, 255]
                }
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            status: {
                type: DataTypes.ENUM('planning', 'active', 'on_hold', 'completed', 'archived'),
                allowNull: false,
                defaultValue: 'active'
            },
            start_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            end_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            budget: {
                type: DataTypes.DECIMAL(15, 2),
                allowNull: true,
                validate: {
                    min: 0
                }
            },
            progress: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
                validate: {
                    min: 0,
                    max: 100
                }
            },
            settings: {
                type: DataTypes.JSONB,
                allowNull: false,
                defaultValue: {
                    is_public: false,
                    allow_guest_comments: false,
                    task_approval_required: false,
                    default_task_status: 'todo'
                }
            },
            tags: {
                type: DataTypes.ARRAY(DataTypes.STRING),
                allowNull: false,
                defaultValue: []
            },
            created_by: {
                type: DataTypes.UUID,
                allowNull: false,
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

            modelName: 'Project',
            
        }
    );

    return Project;
}