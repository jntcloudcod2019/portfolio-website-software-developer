export interface AgentDBConfig {
  dimensions: number;
  indexType: 'HNSW' | 'flat' | 'ivf';
  distanceMetric?: 'cosine' | 'euclidean' | 'dot';
  efConstruction?: number;
  M?: number;
  maxConnections?: number;
  vectorCacheSize?: number;
  enablePersistence?: boolean;
  persistencePath?: string;
  enableCaching?: boolean;
  cacheTTLMs?: number;
  writeConcurrency?: number;
  readConcurrency?: number;
  targetThroughput?: number;
  targetLatencyMs?: number;
}

export interface AgentDBConnection {
  id: string;
  host: string;
  port: number;
  auth?: {
    type: 'basic' | 'token' | 'certificate';
    credentials?: any;
  };
  options?: any;
}

export interface StoredVector {
  id: string;
  vector: number[];
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  ttl?: Date;
  labels?: string[];
}

export interface SearchResult extends StoredVector {
  score: number;
}

export class AgentDBAdapter {
  private connectionPool: Map<string, any>;
  private vectors: Map<string, StoredVector>;
  private index?: HNSWIndex;
  private performanceMetrics: AgentDBMetrics;

  constructor(
    private config: AgentDBConfig,
    private connections: AgentDBConnection[] = []
  ) {
    this.connectionPool = new Map();
    this.vectors = new Map();
    this.performanceMetrics = new AgentDBMetrics();

    if (this.config.indexType === 'HNSW') {
      this.index = new HNSWIndex({
        dimensions: config.dimensions || 1536,
        efConstruction: config.efConstruction || 200,
        M: config.M || 16,
        maxConnections: config.maxConnections || 50,
      });
    }

    this.initializeConnections();
  }

  async store(vector: StoredVector): Promise<void> {
    const start = Date.now();

    try {
      if (this.config.indexType === 'HNSW' && this.index) {
        await this.index.add(vector.id, vector.vector);
      }

      this.vectors.set(vector.id, {
        ...vector,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      if (this.config.enableCaching) {
        await this.cacheVector(vector);
      }

      this.performanceMetrics.recordWrite(Date.now() - start);
    } catch (error) {
      this.performanceMetrics.recordError(error as Error);
      throw error;
    }
  }

  async search(
    queryVector: number[],
    options: {
      limit?: number;
      threshold?: number;
      filter?: (vector: StoredVector) => boolean;
      ef?: number;
    } = {}
  ): Promise<SearchResult[]> {
    const start = Date.now();

    try {
      let results: SearchResult[];

      if (this.config.indexType === 'HNSW' && this.index) {
        const similarIds = this.index.search(queryVector, options.ef || 50);
        results = similarIds
          .map(id => {
            const vector = this.vectors.get(id);
            if (!vector) return null;

            const score = this.calculateSimilarity(queryVector, vector.vector);
            return { ...vector, score } as SearchResult;
          })
          .filter((result): result is SearchResult => result !== null)
          .sort((a, b) => b.score - a.score);
      } else {
        results = Array.from(this.vectors.values())
          .map(vector => {
            const score = this.calculateSimilarity(queryVector, vector.vector);
            return { ...vector, score } as SearchResult;
          })
          .sort((a, b) => b.score - a.score);
      }

      if (options.filter) {
        results = results.filter(options.filter);
      }

      if (options.threshold) {
        results = results.filter(r => r.score >= options.threshold);
      }

      results = results.slice(0, options.limit || 10);

      this.performanceMetrics.recordQuery(Date.now() - start, results.length);
      return results;
    } catch (error) {
      this.performanceMetrics.recordError(error as Error);
      throw error;
    }
  }

  async get(id: string): Promise<StoredVector | null> {
    return this.vectors.get(id) || null;
  }

  async update(id: string, updates: Partial<StoredVector>): Promise<void> {
    const vector = this.vectors.get(id);
    if (!vector) {
      throw new Error(`Vector with id ${id} not found`);
    }

    const updatedVector: StoredVector = {
      ...vector,
      ...updates,
      updatedAt: new Date(),
    };

    this.vectors.set(id, updatedVector);

    if (this.config.indexType === 'HNSW' && this.index) {
      await this.index.update(id, updatedVector.vector);
    }
  }

  async delete(id: string): Promise<void> {
    this.vectors.delete(id);

    if (this.config.indexType === 'HNSW' && this.index) {
      await this.index.remove(id);
    }
  }

  async batchStore(vectors: StoredVector[]): Promise<void> {
    for (const vector of vectors) {
      await this.store(vector);
    }
  }

  async batchSearch(
    queryVectors: number[],
    options: any = {}
  ): Promise<SearchResult[][]> {
    const results: SearchResult[][] = [];

    for (const queryVector of queryVectors) {
      results.push(await this.search(queryVector, options));
    }

    return results;
  }

  async clear(): Promise<void> {
    this.vectors.clear();

    if (this.config.indexType === 'HNSW' && this.index) {
      await this.index.clear();
    }
  }

  public async persist(): Promise<void> {
    if (!this.config.enablePersistence || !this.config.persistencePath) {
      return;
    }

    const data = Array.from(this.vectors.values());
    await this.writeToDisk(data);
  }

  public async restore(): Promise<void> {
    if (!this.config.enablePersistence || !this.config.persistencePath) {
      return;
    }

    const data = await this.readFromDisk();
    for (const vector of data) {
      this.vectors.set(vector.id, vector);
    }
  }

  async getStats(): Promise<AgentDBStats> {
    return {
      totalVectors: this.vectors.size,
      indexType: this.config.indexType,
      hasIndex: !!this.index,
      memoryUsage: this.calculateMemoryUsage(),
      performance: this.performanceMetrics.getStats(),
    };
  }

  private calculateSimilarity(a: number[], b: number[]): number {
    switch (this.config.distanceMetric || 'cosine') {
      case 'euclidean':
        return 1 / (1 + this.euclideanDistance(a, b));
      case 'dot':
        return this.dotProduct(a, b);
      case 'cosine':
      default:
        return this.cosineSimilarity(a, b);
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = this.dotProduct(a, b);
    const normA = Math.sqrt(this.dotProduct(a, a));
    const normB = Math.sqrt(this.dotProduct(b, b));

    if (normA === 0 || normB === 0) {
      return 0;
    }

    return dotProduct / (normA * normB);
  }

  private euclideanDistance(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += Math.pow(a[i] - b[i], 2);
    }
    return Math.sqrt(sum);
  }

  private dotProduct(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
      sum += a[i] * b[i];
    }
    return sum;
  }

  private async cacheVector(vector: StoredVector): Promise<void> {
    if (!this.config.enableCaching) return;

    const key = `vector:${vector.id}`;
    await this.setCache(key, vector, this.config.cacheTTLMs || 300000);
  }

  private async getCache(key: string): Promise<any | null> {
    // Implementation depends on cache backend
    return null;
  }

  private async setCache(key: string, value: any, ttl: number): Promise<void> {
    // Implementation depends on cache backend
  }

  private initializeConnections(): void {
    for (const connection of this.connections) {
      this.connectionPool.set(connection.id, connection);
    }
  }

  private calculateMemoryUsage(): { total: number; vectors: number; overhead: number } {
    const vectorSize = 32;
    const metadataSize = 128;
    const overhead = 50;

    const vectorsMemory = this.vectors.size * (vectorSize + metadataSize + overhead);

    return {
      total: vectorsMemory + (this.index?.getMemoryUsage() || 0),
      vectors: this.vectors.size,
      overhead,
    };
  }
}

export interface HNSWIndex {
  add(id: string, vector: number[]): Promise<void>;
  search(query: number[], ef?: number): Promise<string[]>;
  update(id: string, vector: number[]): Promise<void>;
  remove(id: string): Promise<void>;
  clear(): Promise<void>;
  getMemoryUsage(): number;
}

export class HNSWIndex {
  private _data: Map<string, number[]>;
  private _graph: Map<string, Set<string>>;

  constructor(
    private config: {
      dimensions: number;
      efConstruction?: number;
      M?: number;
      maxConnections?: number;
    }
  ) {
    this._data = new Map();
    this._graph = new Map();
  }

  async add(id: string, vector: number[]): Promise<void> {
    this._data.set(id, vector);
    this._graph.set(id, new Set());
  }

  async search(query: number[], ef: number = 50): Promise<string[]> {
    if (this._data.size === 0) return [];

    const similarities = Array.from(this._data.entries()).map(([id, vector]) => ({
      id,
      similarity: this.cosineSimilarity(query, vector),
    }));

    similarities.sort((a, b) => b.similarity - a.similarity);

    return similarities.slice(0, Math.min(ef, similarities.length)).map(item => item.id);
  }

  async update(id: string, vector: number[]): Promise<void> {
    if (this._data.has(id)) {
      this._data.set(id, vector);
    }
  }

  async remove(id: string): Promise<void> {
    this._data.delete(id);
    this._graph.delete(id);
  }

  async clear(): Promise<void> {
    this._data.clear();
    this._graph.clear();
  }

  cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

    if (normA === 0 || normB === 0) return 0;

    return dotProduct / (normA * normB);
  }

  getMemoryUsage(): number {
    return this._data.size * 128; // Approximate memory per vector
  }
}

export class AgentDBMetrics {
  private writes: number = 0;
  private reads: number = 0;
  private errors: number = 0;
  private queryTimes: number[] = [];
  private writeTimes: number[] = [];

  recordWrite(time: number): void {
    this.writes++;
    this.writeTimes.push(time);
    if (this.writeTimes.length > 1000) {
      this.writeTimes.shift();
    }
  }

  recordQuery(time: number, resultCount: number): void {
    this.reads++;
    this.queryTimes.push(time);
    if (this.queryTimes.length > 1000) {
      this.queryTimes.shift();
    }
  }

  recordError(error: Error): void {
    this.errors++;
  }

  getStats(): AgentDBStats {
    return {
      writes: this.writes,
      reads: this.reads,
      errors: this.errors,
      errorRate: this.writes > 0 ? this.errors / this.writes : 0,
      avgWriteTime: this.writeTimes.length > 0
        ? this.writeTimes.reduce((a, b) => a + b, 0) / this.writeTimes.length
        : 0,
      avgQueryTime: this.queryTimes.length > 0
        ? this.queryTimes.reduce((a, b) => a + b, 0) / this.queryTimes.length
        : 0,
      throughput: this.writes + this.reads,
      queriesPerSecond: this.queryTimes.length > 0
        ? 1000 / (this.queryTimes.reduce((a, b) => a + b, 0) / this.queryTimes.length)
        : 0,
    };
  }
}

export interface AgentDBStats {
  writes: number;
  reads: number;
  errors: number;
  errorRate: number;
  avgWriteTime: number;
  avgQueryTime: number;
  throughput: number;
  queriesPerSecond: number;
}
