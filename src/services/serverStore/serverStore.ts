// WARNING: This data persists between requests!
// Make sure to scope and clean up data appropriately

class ServerStore {
    private static instance: ServerStore;

    private translations: Map<string, Record<string, string>>;
    // private timeCashed: Map<string, number>;

    private constructor() {
        this.translations = new Map();
        // this.timeCashed = new Map();
    }

    public static getInstance(): ServerStore {
        if (!ServerStore.instance) {
            ServerStore.instance = new ServerStore();
        }
        return ServerStore.instance;
    }

    // Use request ID or similar to scope data to specific request
    setTranslation(key: string, value: Record<string, string>): void {
        this.translations.set(key, value);
        // this.timeCashed.set(key, Date.now());
    }

    getTranslation(key: string): Record<string, string> | undefined {
        return this.translations.get(key);
    }

    clearTranslation(key: string): void {
        this.translations.delete(key);
        // this.timeCashed.delete(key)
    }

    // TODO: Implement Key Caching by time for translation
    // async getOrRefresh(key: string, refresh: () => Promise<void>) {
    //     const _timeCached = this.getTimeCached(key)
    //     if (!_timeCached || this.isStale(_timeCached)) {
    //         this.clearRequest(key);
    //         const result = await refresh();
    //         this.setTranslation(key, result);
    //         console.vlog("serverStore : getOrRefresh", "gray", key, true);
    //     }
    //     return this.getTranslation(key) as Record<string, string>;
    // }

    // isStale(timestamp: number) {
    //     // const ONE_HOUR = 60 * 60 * 1000; // 1 hour in milliseconds
    //     const ONE_MIN = 60 * 1000; // 1 minute in milliseconds
    //     return Date.now() - timestamp > ONE_MIN;
    // }

    // setTimeCached(key: string, value: number) {
    //     this.timeCashed.set(key, value)
    // }

    // getTimeCached(key: string) {
    //     return this.timeCashed.get(key)
    // }
}

const serverStore = ServerStore.getInstance();
export default serverStore;
