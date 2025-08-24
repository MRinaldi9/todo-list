class DatabaseLayer {
  #db!: Deno.Kv;
  static #instance: DatabaseLayer;

  private constructor() {}

  static async getInstance() {
    if (!this.#instance) {
      this.#instance = new DatabaseLayer();
      await this.#instance.initialize();
    }
    return this.#instance;
  }

  public async deleteAllEntries(prefix: string[]) {
    for await (const entry of this.#db.list({ prefix })) {
      this.#db.delete(entry.key);
    }
  }

  public async upsertEntry(key: Deno.KvKey, value: unknown) {
    return await this.#db.set(key, value);
  }

  public async getEntry<T>(
    key: Deno.KvKey,
    options?: { consistency?: Deno.KvConsistencyLevel },
  ): Promise<Deno.KvEntryMaybe<T>> {
    return await this.#db.get(key, options);
  }

  public atomic() {
    return this.#db.atomic();
  }

  private async initialize() {
    this.#db = await Deno.openKv();
  }
}

export const db = await DatabaseLayer.getInstance();
