import { users, type User, type InsertUser, AbortionStat, InsertAbortionStat } from "@shared/schema";
import { abortionData } from "@shared/abortionData";
import { LegalStatus, Region, DataView } from "@shared/schema";

// modify the interface with any CRUD methods needed
export interface IStorage {
  // Original user methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Abortion statistics methods
  getAllAbortionStats(): Promise<AbortionStat[]>;
  getAbortionStatById(stateId: string): Promise<AbortionStat | undefined>;
  getFilteredAbortionStats(
    region?: Region,
    legalStatus?: LegalStatus,
    dataView?: DataView,
    searchTerm?: string
  ): Promise<AbortionStat[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private abortionStats: Map<string, AbortionStat>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.abortionStats = new Map();
    this.currentId = 1;
    
    // Pre-populate abortion statistics
    abortionData.forEach(stat => {
      this.abortionStats.set(stat.stateId, stat);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Abortion statistics methods
  async getAllAbortionStats(): Promise<AbortionStat[]> {
    return Array.from(this.abortionStats.values());
  }
  
  async getAbortionStatById(stateId: string): Promise<AbortionStat | undefined> {
    return this.abortionStats.get(stateId);
  }
  
  async getFilteredAbortionStats(
    region: Region = Region.ALL,
    legalStatus: LegalStatus = LegalStatus.ALL,
    dataView: DataView = DataView.TOTAL,
    searchTerm: string = ""
  ): Promise<AbortionStat[]> {
    let stats = Array.from(this.abortionStats.values());
    
    // Apply region filter
    if (region !== Region.ALL) {
      stats = stats.filter(stat => stat.region.toLowerCase() === region.toLowerCase());
    }
    
    // Apply legal status filter
    if (legalStatus !== LegalStatus.ALL) {
      stats = stats.filter(stat => stat.status.toLowerCase() === legalStatus.toLowerCase());
    }
    
    // Apply search term filter
    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase().trim();
      stats = stats.filter(stat => 
        stat.stateName.toLowerCase().includes(search) || 
        stat.stateId.toLowerCase().includes(search)
      );
    }
    
    // Sort based on dataView
    if (dataView === DataView.RATE) {
      stats = stats.sort((a, b) => parseFloat(b.rate.toString()) - parseFloat(a.rate.toString()));
    } else if (dataView === DataView.PERCENTAGE) {
      stats = stats.sort((a, b) => parseFloat(b.change.toString()) - parseFloat(a.change.toString()));
    } else {
      // Default: sort by total count
      stats = stats.sort((a, b) => b.count - a.count);
    }
    
    return stats;
  }
}

export const storage = new MemStorage();
