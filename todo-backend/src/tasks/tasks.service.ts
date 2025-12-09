import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  private readonly RECENT_TASKS_LIMIT = 5;

  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async createTask(title: string, description?: string): Promise<Task> {
    if (!title || title.trim().length === 0) {
      throw new Error('Title is required and cannot be empty');
    }

    const taskData: Partial<Task> = {
      title: title.trim(),
      description: description?.trim() || null,
      is_completed: false,
    };

    const task = this.taskRepository.create(taskData);
    return await this.taskRepository.save(task);
  }

  async getRecentTasks(): Promise<Task[]> {
    return await this.taskRepository.find({
      where: { is_completed: false },
      order: { created_at: 'DESC' },
      take: this.RECENT_TASKS_LIMIT,
    });
  }

  async markTaskComplete(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });

    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }

    if (task.is_completed) {
      return task; 
    }

    await this.taskRepository.update(id, { is_completed: true });
    return await this.taskRepository.findOne({ where: { id } }) as Task;
  }
}

