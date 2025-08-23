/* eslint-disable @typescript-eslint/no-dynamic-delete */
import { Query } from "mongoose";
import { excludeField } from "../constants";

export class QueryBuilder<T> {
    public modelQuery: Query<T[], T>;
    public readonly query: Record<string, string>;

    constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
        this.modelQuery = modelQuery;
        this.query = query;
    }

    // filter--------------------
    filter(): this {
        const filter = { ...this.query }

        for (const field of excludeField) {
            delete filter[field];
        }

        this.modelQuery = this.modelQuery.find(filter)
        return this
    }

    // Search--------------------
    search(searchableField: string[]): this {

        const searchTerm = this.query.searchTerm || ""

        const searchQuery = {
            $or: searchableField.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
        }
        this.modelQuery = this.modelQuery.find(searchQuery)
        return this
    }

    // Sort-------------------- 
    sort(): this {
        const sort = this.query.sort?.split(',')?.join(' ') || "-createdAt"; 
        this.modelQuery = this.modelQuery.sort(sort);  
        return this;
    }


    // Pagination--------------------
    paginate(): this {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;

        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }

    build() {
        return this.modelQuery;
    }

    async getMeta() {
        const totalDocuments = await this.modelQuery.model.countDocuments();
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const totalPage = Math.ceil(totalDocuments / limit);

        return { page, limit, total: totalDocuments, totalPage };
    }
}