class DatabaseLayer {
  #db!: Deno.Kv;
  static #instance: DatabaseLayer;

  private constructor() {}

  static async getInstance(): Promise<DatabaseLayer> {
    if (!this.#instance) {
      this.#instance = new DatabaseLayer();
      await this.#instance.initialize();
    }
    return this.#instance;
  }

  public async deleteAllEntries(prefix: string[]): Promise<void> {
    for await (const entry of this.#db.list({ prefix })) {
      this.#db.delete(entry.key);
    }
  }

  public async upsertEntry(
    key: Deno.KvKey,
    value: unknown,
  ): Promise<Deno.KvCommitResult> {
    return await this.#db.set(key, value);
  }

  public async getEntry<T>(
    key: Deno.KvKey,
    options?: { consistency?: Deno.KvConsistencyLevel },
  ): Promise<Deno.KvEntryMaybe<T>> {
    return await this.#db.get(key, options);
  }

  public async getEntries<T>(
    selector: Deno.KvListSelector,
    options?: Deno.KvListOptions,
  ): Promise<Deno.KvEntry<T>[]> {
    const entries: Deno.KvEntry<T>[] = [];
    for await (const entry of this.#db.list<T>(selector, options)) {
      entries.push(entry);
    }
    return entries;
  }

  public atomic(): Deno.AtomicOperation {
    return this.#db.atomic();
  }

  private async initialize(): Promise<void> {
    this.#db = await Deno.openKv();
  }
}

export const db = await DatabaseLayer.getInstance();
