import guardProfileSchema from './schemas/guard_profile_schema.json';
import mcpServerSchema from './schemas/mcp_server_schema.json';
import serverCollectionSchema from './schemas/server_collection_schema.json';

// Schema URIs for Monaco Editor
export const SCHEMA_URIS = {
  GUARD_PROFILE: 'http://mcp-guardian/schemas/guard_profile_schema.json',
  MCP_SERVER: 'http://mcp-guardian/schemas/mcp_server_schema.json',
  SERVER_COLLECTION: 'http://mcp-guardian/schemas/server_collection_schema.json',
};

// Schema objects for direct use
export const SCHEMAS = {
  GUARD_PROFILE: guardProfileSchema,
  MCP_SERVER: mcpServerSchema,
  SERVER_COLLECTION: serverCollectionSchema,
};

/**
 * Configure Monaco Editor with all available schemas
 * @param monaco Monaco instance
 */
export const configureMonacoSchemas = (monaco: any) => {
  monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
    validate: true,
    schemas: [
      {
        uri: SCHEMA_URIS.GUARD_PROFILE,
        fileMatch: ['*guard_profile*'],
        schema: SCHEMAS.GUARD_PROFILE,
      },
      {
        uri: SCHEMA_URIS.MCP_SERVER,
        fileMatch: ['*mcp_server*'],
        schema: SCHEMAS.MCP_SERVER,
      },
      {
        uri: SCHEMA_URIS.SERVER_COLLECTION, 
        fileMatch: ['*server_collection*'],
        schema: SCHEMAS.SERVER_COLLECTION,
      },
    ],
  });
};

/**
 * Get schema based on entity type
 * @param entityType Type of entity (guard_profile, mcp_server, server_collection)
 */
export const getSchemaForEntityType = (entityType: string) => {
  switch (entityType.toLowerCase()) {
    case 'guard_profile':
      return { schema: SCHEMAS.GUARD_PROFILE, uri: SCHEMA_URIS.GUARD_PROFILE };
    case 'mcp_server':
      return { schema: SCHEMAS.MCP_SERVER, uri: SCHEMA_URIS.MCP_SERVER };
    case 'server_collection':
      return { schema: SCHEMAS.SERVER_COLLECTION, uri: SCHEMA_URIS.SERVER_COLLECTION };
    default:
      return null;
  }
};

export default {
  SCHEMA_URIS,
  SCHEMAS,
  configureMonacoSchemas,
  getSchemaForEntityType,
};