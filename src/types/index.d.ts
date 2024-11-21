export type Category =
  | "clothing"
  | "electronics"
  | "toiletries"
  | "documents"
  | "accessories"
  | "stationary"
  | "health"
  | "food"
  | "books";

export type PackingContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
};

export interface Item {
  id: string;
  name: string;
  category: Category;
  isPacked: Boolean;
  tags?: ItemTag[];
}

export type ItemTag = string;

export interface State {
  items: Item[];
  selectedCategory: Category | "all";
  unpackedSearchQuery: string;
  packedSearchQuery: string;
  activityLog: Activity[];
}

export type Action =
  | { type: "TOGGLE_PACK"; payload: string }
  | { type: "SET_CATEGORY"; payload: Category | "all" }
  | { type: "SET_UNPACKED_SEARCH_QUERY"; payload: string }
  | { type: "SET_PACKED_SEARCH_QUERY"; payload: string }
  | { type: "ADD_ITEM"; payload: Item }
  | { type: "EDIT_ITEM_NAME"; payload: { id: string; name: string } }
  | { type: "UNPACK_ALL" }
  | { type: "ADD_CATEGORY"; payload: { name: string; color: string } }
  | { type: "MOVE_ITEM"; id: string; isPacked: Boolean }
  | { type: "ADD_ITEM_TAG";
      payload: {
        id: string;
        tag: string;
        customTag?: string;
      };
    };

export type GroupedItems = {
  [K in Category]: Item[];
};

export type ActivityType =
  | "ADD_ITEM"
  | "PACK"
  | "UNPACK"
  | "UNPACK_ALL"
  | "EDIT_ITEM"
  | "ADD_TAG";

export interface Activity {
  id: string;
  type: ActivityType;
  itemId: string;
  timestamp: string;
  details?: {
    oldName?: string;
    newName?: string;
    tag?: ItemTag;
    tags?: ItemTag[];
  };
}
