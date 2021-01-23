import { FeedItem } from "../components/explorer/Feed"

export enum BookmarkDateMode {
    day = 0,
    week = 1,
    month = 2,
    year = 3,
    all = 4
}

export enum BookmarkSortMode {
    pinned = 0,
    date = 1,
    views = 2,
}

export enum BookmarkViewMode {
    grid = 0,
    rows = 1,
}

export class BookmarkSettings {
    sortMode = BookmarkSortMode.date
    viewMode = BookmarkViewMode.grid
    dateMode = BookmarkDateMode.day

    selectedGuid: string | null = null

    FeedItemList: FeedItem[] = []
}

