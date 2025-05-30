import { createCollection, updateCollection } from "@directus/sdk";
import * as z from "zod";
import { defineTool } from "../utils/define.js";
import {
	formatErrorResponse,
	formatSuccessResponse,
} from "../utils/response.js";

export const createCollectionTool = defineTool("create-collection", {
	description: `Create a new collection in Directus. The 'collection' and 'schema' properties are required. You can also provide an array of 'fields' to be created during the creation of the collection.`,
	inputSchema: z.object({
		collection: z.string().describe("Unique name of the collection."),
		schema: z
			.union([z.object({}), z.null()])
			.describe("Schema definition for the collection, or null for a folder."),
		fields: z
			.array(
				z.object({
					field: z.string(),
					type: z.string(),
					interface: z.string(),
				})
			)
			.optional()
			.describe("Fields to be created in the collection."),
		meta: z
			.record(z.string(), z.unknown())
			.optional()
			.describe("Optional meta properties for the collection."),
	}),
	handler: async (directus, input) => {
		try {
			const { collection, schema, fields, meta } = input;
			const collectionObject: any = {
				collection,
				schema,
			};
			if (fields) collectionObject.fields = fields;
			if (meta) Object.assign(collectionObject, meta);
			const result = await directus.request(createCollection(collectionObject));
			return formatSuccessResponse(result);
		} catch (error) {
			return formatErrorResponse(error);
		}
	},
});

export const updateCollectionTool = defineTool("update-collection", {
	description: `Update the metadata for an existing collection. Only the 'meta' values of the collection object can be updated. Updating the collection name is not supported at this time.`,
	inputSchema: z.object({
		collection: z.string().describe("Unique identifier of the collection."),
		meta: z
			.record(z.string(), z.unknown())
			.describe("Metadata of the collection."),
	}),
	handler: async (directus, input) => {
		try {
			const { collection, meta } = input;
			const result = await directus.request(
				updateCollection(collection, { meta })
			);
			return formatSuccessResponse(result);
		} catch (error) {
			return formatErrorResponse(error);
		}
	},
});
