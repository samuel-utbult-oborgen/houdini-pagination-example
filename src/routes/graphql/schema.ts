import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import { createSchema } from "graphql-yoga";
import data from "./data";
import { connectionFromArray, type Args } from "./connections";

const typeDefs = readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "schema.graphql"),
    "utf8",
);

const resolvers = {
    Query: {
        country(_: unknown, { id }: { id: number }) {
            return data.countries[id - 1];
        },
        countries(_: unknown, args: Args) {
            return connectionFromArray(data.countries, args);
        },
        currency(_: unknown, { id }: { id: number }) {
            return data.currencies[id - 1];
        },
        currencies(_: unknown, args: Args) {
            return connectionFromArray(data.currencies, args);
        },
        customer(_: unknown, { id }: { id: number }) {
            return data.customers[id - 1];
        },
        customers(_: unknown, args: Args) {
            return connectionFromArray(data.customers, args);
        },
    },
};

export const schema = createSchema({
    typeDefs,
    resolvers,
});
