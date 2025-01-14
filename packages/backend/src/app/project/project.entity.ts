import { EntitySchema } from 'typeorm'
import { AppConnection, Flow, Folder, Project, TriggerEvent, User } from '@activepieces/shared'
import { ApIdSchema, BaseColumnSchemaPart } from '../helper/base-entity'
import { ConnectionKey, AppCredential } from '@activepieces/ee/shared'

type ProjectSchema = {
    owner: User
    flows: Flow[]
    connectionKeys: ConnectionKey[]
    appCredentials: AppCredential[]
    files: File[]
    folders: Folder[]
    events: TriggerEvent[]
    appConnections: AppConnection[]
} & Project

export const ProjectEntity = new EntitySchema<ProjectSchema>({
    name: 'project',
    columns: {
        ...BaseColumnSchemaPart,
        ownerId: ApIdSchema,
        displayName: {
            type: String,
        },
        notifyStatus: {
            type: String,
        },
    },
    indices: [
        {
            name: 'idx_project_owner_id',
            columns: ['ownerId'],
            unique: false,
        },
    ],
    relations: {
        folders: {
            type: 'one-to-many',
            target: 'folder',
            inverseSide: 'project',
        },
        appConnections: {
            type: 'one-to-many',
            target: 'app_connection',
            inverseSide: 'project',
        },
        appCredentials: {
            type: 'one-to-many',
            target: 'app_credential',
            inverseSide: 'project',
        },
        connectionKeys: {
            type: 'one-to-many',
            target: 'connection_key',
            inverseSide: 'project',
        },
        owner: {
            type: 'many-to-one',
            target: 'user',
            joinColumn: {
                name: 'ownerId',
                foreignKeyConstraintName: 'fk_project_owner_id',
            },
        },
        events: {
            type: 'one-to-many',
            target: 'trigger_event',
            inverseSide: 'project',
        },
        files: {
            type: 'one-to-many',
            target: 'file',
            inverseSide: 'project',
        },
        flows: {
            type: 'one-to-many',
            target: 'flow',
            inverseSide: 'project',
        },
    },
})
