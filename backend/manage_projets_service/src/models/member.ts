import { DataTypes, Model, Optional, Sequelize } from 'sequelize';
import { IMember, IMemberCreate, MemberRole } from '../interfaces/member.interface';

type MemberCreationAttributes = Optional<IMemberCreate, 'role' | 'permissions'>;

class Member extends Model<IMember, MemberCreationAttributes> implements IMember {
  public id!: string;
  public organization_id!: string;
  public user_id!: string;
  public role!: MemberRole;
  public permissions!: IMember['permissions'];
  public joined_at!: Date;
  public created_at!: Date;
  public updated_at!: Date;
}

export default function (sequelize: Sequelize): typeof Member {
  Member.init(
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
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('owner', 'admin', 'member', 'viewer'),
        allowNull: false,
        defaultValue: 'member'
      },
      permissions: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {
          can_create_projects: false,
          can_edit_projects: false,
          can_delete_projects: false,
          can_invite_members: false,
          can_remove_members: false,
          can_manage_tasks: true
        }
      },
      joined_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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
      modelName: 'Member',
    }
  );

  return Member;
}