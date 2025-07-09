import { printSchemaWithDirectives } from '@graphql-tools/utils';
import SchemaBuilder from '@pothos/core';
import DirectivesPlugin from '@pothos/plugin-directives';
import FederationPlugin from '@pothos/plugin-federation';

const builder = new SchemaBuilder<{
  Directives: {
    custom: {
      locations: 'INTERFACE' | 'OBJECT';
      args: {};
    };
    link: {
      locations: 'SCHEMA';
      args: {
        url: string;
        import: string[];
      };
    };
  };
}>({
  plugins: [DirectivesPlugin, FederationPlugin],
  directives: {
    useGraphQLToolsUnorderedDirectives: true,
  },
});

export interface NodeShape {
    id: string;
    deprecatedField: string;
  }

  export const Node = builder.interfaceRef<NodeShape>("Node").implement({
    fields: (t) => ({
      id: t.exposeID("id"),
      deprecatedField: t.exposeString("deprecatedField", {
        deprecationReason: "...",
      }),
    }),
  });

  export interface UserShape extends NodeShape {
    name: string;
  }

  export const User = builder.objectRef<UserShape>("User");

  User.implement({
    interfaces: [Node],
    fields: (t) => ({
      name: t.exposeString("name"),
    }),
  });

  // builder
  builder.queryType({
    fields: (t) => ({
      hello: t.string({
        resolve: () => "Hello, world!",
      }),
    }),
  });


  export const schema = builder.toSubGraphSchema({});

  console.log(printSchemaWithDirectives(schema));

