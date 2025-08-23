export class DatabaseLayer {
  #db!: Deno.Kv;
  static #instance: DatabaseLayer;

  private constructor() {}

  private async initialize() {
    this.#db = await Deno.openKv();
  }

  static async getInstance() {
    if (!this.#instance) {
      this.#instance = new DatabaseLayer();
      await this.#instance.initialize();
    }
    return this.#instance;
  }

  public getDb() {
    return this.#db;
  }

  async deleteAllEntries(prefix: string[]) {
    for await (const entry of this.#db.list({ prefix })) {
      this.#db.delete(entry.key);
    }
  }
}

export const db = await DatabaseLayer.getInstance();
