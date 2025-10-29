import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { ITask, ITaskCreate, TaskStatus, TaskPriority } from '../interfaces/task.interface';

type TaskCreationAttributes = Optional<ITaskCreate, 'description' | 'status' | 'priority' | 'due_date' | 'estimated_hours' | 'assignee_id' | 'position' | 'tags' | 'metadata'>;

class Task extends Model<ITask, TaskCreationAttributes> implements ITask {
  public id!: string;
  public project_id!: string;
  public organization_id!: string;
  public title!: string;
  public description!: string;
  public status!: TaskStatus;
  public priority!: TaskPriority;
  public due_date!: Date;
  public estimated_hours!: number;
  public actual_hours!: number;
  public assignee_id!: string;
  public created_by!: string;
  public position!: number;
  public tags!: string[];
  public metadata!: ITask['metadata'];
  public created_at!: Date;
  public updated_at!: Date;
}

export default function (sequelize: Sequelize): typeof Task {
  Task.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      project_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'projects',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      organization_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'organizations',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      title: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [2, 500]
        }
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('todo', 'in_progress', 'review', 'done', 'cancelled'),
        allowNull: false,
        defaultValue: 'todo'
      },
      priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: false,
        defaultValue: 'medium'
      },
      due_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      estimated_hours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        validate: {
          min: 0
        }
      },
      actual_hours: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        defaultValue: 0,
        validate: {
          min: 0
        }
      },
      assignee_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: 'users', // Reference to auth-service users table
          key: 'id'
        }
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'users', // Reference to auth-service users table
          key: 'id'
        }
      },
      position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: []
      },
      metadata: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
          parent_task_id: null,
          is_subtask: false,
          dependencies: [],
          attachments_count: 0,
          comments_count: 0
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
      tableName: 'tasks',
      modelName: 'Task',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          fields: ['project_id', 'status']
        },
        {
          fields: ['organization_id', 'assignee_id']
        },
        {
          fields: ['due_date']
        },
        {
          fields: ['tags'], // GIN index for array searching
          using: 'GIN'
        }
      ],
      hooks: {
        beforeUpdate: (task: Task) => {
          task.updated_at = new Date();
        }
      }
    }
  );

  return Task;
}