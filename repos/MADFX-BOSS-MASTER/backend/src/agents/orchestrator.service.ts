
import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

interface KanbanItem {
  id: string;
  title: string;
  agent: string;
  priority: string;
}

interface KanbanBoard {
  sprint: number;
  updated: string;
  backlog: KanbanItem[];
  in_progress: KanbanItem[];
  review: KanbanItem[];
  done: KanbanItem[];
  blocked: KanbanItem[];
}

interface AgentStatus {
  name: string;
  status: 'idle' | 'working' | 'offline';
  currentTask: string | null;
  lastSeen: Date;
}

@Injectable()
export class OrchestratorService {
  private readonly logger = new Logger(OrchestratorService.name);
  private readonly kanbanPath = path.resolve('/Users/madfxbossllc/repos/MADFX-BOSS-MASTER/KANBAN.json');
  
  private agents: Map<string, AgentStatus> = new Map();
  private readonly AGENT_NAMES = [
    'AGENT-SIGNAL', 'AGENT-CODER-A', 'AGENT-CODER-B', 'AGENT-CODER-C', 
    'AGENT-BACKTEST', 'AGENT-DEVOPS', 'AGENT-REPORTER', 'AGENT-QA', 
    'AGENT-RESEARCH', 'AGENT-MANAGER'
  ];

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents() {
    this.AGENT_NAMES.forEach(name => {
      this.agents.set(name, {
        name,
        status: 'idle',
        currentTask: null,
        lastSeen: new Date(),
      });
    });
    this.logger.log(`Initialized ${this.agents.size} agents.`);
  }

  private readKanban(): KanbanBoard {
    try {
      const data = fs.readFileSync(this.kanbanPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      this.logger.error('Failed to read KANBAN.json', error);
      throw error;
    }
  }

  private writeKanban(board: KanbanBoard) {
    try {
      fs.writeFileSync(this.kanbanPath, JSON.stringify(board, null, 2));
    } catch (error) {
      this.logger.error('Failed to write KANBAN.json', error);
      throw error;
    }
  }

  /**
   * synchronizes the Kanban board by assigning pending backlog items to idle agents.
   */
  async synchronize() {
    this.logger.log('Synchronizing agents with KANBAN...');
    const board = this.readKanban();
    let changesMade = false;

    for (const agent of this.agents.values()) {
      if (agent.status === 'idle') {
        // Find a task in backlog assigned to this agent
        const taskIndex = board.backlog.findIndex(item => item.agent === agent.name);
        
        if (taskIndex !== -1) {
          const task = board.backlog.splice(taskIndex, 1)[0];
          board.in_progress.push(task);
          
          agent.status = 'working';
          agent.currentTask = task.id;
          
          this.logger.log(`Assigned task ${task.id} (${task.title}) to ${agent.name}`);
          changesMade = true;
        }
      }
    }

    if (changesMade) {
      board.updated = new Date().toISOString();
      this.writeKanban(board);
    } else {
      this.logger.log('No tasks to assign or no idle agents available.');
    }
  }

  /**
   * Mark a task as complete and move it to the 'done' column.
   */
  async completeTask(agentName: string, taskId: string) {
    this.logger.log(`Completing task ${taskId} for agent ${agentName}...`);
    const board = this.readKanban();
    
    const taskIndex = board.in_progress.findIndex(t => t.id === taskId && t.agent === agentName);
    if (taskIndex === -1) {
      throw new Error(`Task ${taskId} not found in progress for agent ${agentName}`);
    }

    const task = board.in_progress.splice(taskIndex, 1)[0];
    board.done.push(task);
    
    // Update agent status
    const agent = this.agents.get(agentName);
    if (agent) {
      agent.status = 'idle';
      agent.currentTask = null;
      agent.lastSeen = new Date();
    }

    board.updated = new Date().toISOString();
    this.writeKanban(board);
    this.logger.log(`Task ${taskId} moved to done. ${agentName} is now idle.`);
  }

  /**
   * Get a snapshot of current agent statuses.
   */
  getAgentStatuses() {
    return Array.from(this.agents.values());
  }

  /**
   * Manually update agent heartbeat/status.
   */
  updateAgentStatus(agentName: string, status: 'idle' | 'working' | 'offline') {
    const agent = this.agents.get(agentName);
    if (!agent) {
      throw new Error(`Agent ${agentName} not recognized.`);
    }
    agent.status = status;
    agent.lastSeen = new Date();
    this.logger.log(`Agent ${agentName} updated to status: ${status}`);
  }
}
