import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.tasksService.createTask(
      createTaskDto.title,
      createTaskDto.description,
    );
  }

  @Get()
  async getRecentTasks(): Promise<Task[]> {
    return await this.tasksService.getRecentTasks();
  }

  @Patch(':id/complete')
  async markTaskComplete(@Param('id') id: string): Promise<Task> {
    return await this.tasksService.markTaskComplete(id);
  }
}

