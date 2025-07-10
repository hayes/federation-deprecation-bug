import SchemaBuilder from '@pothos/core';
import RelayPlugin from '@pothos/plugin-relay'
import { execute, parse } from 'graphql';

const builder = new SchemaBuilder({
  plugins: [RelayPlugin],
});
builder.queryType({
  fields: (t) => ({
    numbers: t.connection({
      type: 'Int',
      resolve: () => {
        return {
          pageInfo: {
            startCursor: '1',
            endCursor: '10',
            hasNextPage: false,
            hasPreviousPage: false,
          },
          edges: (function* () {
            for (let i = 1; i <= 10; i++) {
              yield {
                cursor: i.toString(),
                node: i,
              }
            }
          })(),
        };
      },
    }),
    promiseNumbers: t.connection({
      type: 'Int',
      resolve: () => {
        return {
          pageInfo: {
            startCursor: '1',
            endCursor: '10',
            hasNextPage: false,
            hasPreviousPage: false,
          },
          edges: (function* () {
            for (let i = 1; i <= 10; i++) {
              yield Promise.resolve({
                cursor: i.toString(),
                node: i,
              })
            }
          })(),
        };
      },
    }),
    asyncNumbers: t.connection({
      type: 'Int',
      resolve: () => {
        return {
          pageInfo: {
            startCursor: '1',
            endCursor: '10',
            hasNextPage: false,
            hasPreviousPage: false,
          },
          edges: (async function* () {
            for (let i = 1; i <= 10; i++) {
              yield {
                cursor: i.toString(),
                node: i,
              }
            }
          })(),
        };
      },
    }),
  }),
});

  export const schema = builder.toSchema({});

  Promise.resolve(execute({
    schema,
    document: parse(`
      query {
        numbers {
          pageInfo {
            startCursor
            endCursor
          }
          edges {
            node
            cursor
          }
        }
        promiseNumbers {
          pageInfo {
            startCursor
            endCursor
          }
          edges {
            node
            cursor
          }
        }
        asyncNumbers {
          pageInfo {
            startCursor
            endCursor
          }
          edges {
            node
            cursor
          }
        }
      }
    `,
  ),
  contextValue: {},
})).then(r => console.dir(r, { depth: null })).catch(console.error)


