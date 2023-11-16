import type { GraphQLObject, QueryStoreCursor } from "$houdini";
import { writable, type Readable, type Writable, derived } from "svelte/store";

interface ElementEdge<TElement> {
    node: TElement;
}

interface ElementConnection<TElement> {
    edges: ElementEdge<TElement>[];
    pageInfo: {
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    };
}

type PaginatedInput = {
    after?: string | null | undefined;
};

type PaginatedCursor<TResult extends GraphQLObject, TInput> = QueryStoreCursor<
    TResult,
    TInput & PaginatedInput
>;

type GetConnection<TResult, TElement> = (
    result: TResult,
) => ElementConnection<TElement>;

export type ElementWithID = {
    id: number;
};

export class SelectFieldController<
    TResult extends GraphQLObject,
    TInput,
    TElement extends ElementWithID,
> {
    readonly store: PaginatedCursor<TResult, TInput>;
    readonly getConnection: GetConnection<TResult, TElement>;

    private _selected: Writable<TElement>;
    private _selectedID: Readable<number>;

    constructor(
        store: PaginatedCursor<TResult, TInput>,
        getConnection: GetConnection<TResult, TElement>,
        selected: TElement,
    ) {
        this.store = store;
        this.getConnection = getConnection;
        this._selected = writable(selected);
        this._selectedID = derived(this._selected, ($selected) => $selected.id);
    }

    getSelected(): Readable<TElement> {
        return this._selected;
    }

    getSelectedID(): Readable<number> {
        return this._selectedID;
    }

    setSelected(element: TElement) {
        this._selected.set(element);
    }
}
