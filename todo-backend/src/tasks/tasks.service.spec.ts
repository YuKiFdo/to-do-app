import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('TasksService', () => {
  let service: TasksService;
  let repository: jest.Mocked<Repository<Task>>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get(getRepositoryToken(Task));

    jest.clearAllMocks();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const taskData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Task',
        description: 'Test Description',
        is_completed: false,
        created_at: new Date(),
      };

      const createdTask = {
        ...taskData,
      };

      repository.create.mockReturnValue(createdTask as Task);
      repository.save.mockResolvedValue(taskData as Task);

      const result = await service.createTask('Test Task', 'Test Description');

      expect(result).toEqual(taskData);
      expect(repository.create).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        is_completed: false,
      });
      expect(repository.save).toHaveBeenCalledWith(createdTask);
    });

    it('should create a task without description', async () => {
      const taskData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Task',
        description: null,
        is_completed: false,
        created_at: new Date(),
      };

      const createdTask = {
        ...taskData,
      };

      repository.create.mockReturnValue(createdTask as Task);
      repository.save.mockResolvedValue(taskData as Task);

      const result = await service.createTask('Test Task');

      expect(result).toEqual(taskData);
      expect(repository.create).toHaveBeenCalledWith({
        title: 'Test Task',
        description: null,
        is_completed: false,
      });
      expect(repository.save).toHaveBeenCalledWith(createdTask);
    });

    it('should trim title and description', async () => {
      const taskData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Task',
        description: 'Test Description',
        is_completed: false,
        created_at: new Date(),
      };

      const createdTask = {
        ...taskData,
      };

      repository.create.mockReturnValue(createdTask as Task);
      repository.save.mockResolvedValue(taskData as Task);

      await service.createTask('  Test Task  ', '  Test Description  ');

      expect(repository.create).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        is_completed: false,
      });
      expect(repository.save).toHaveBeenCalled();
    });

    it('should throw error if title is empty', async () => {
      await expect(service.createTask('')).rejects.toThrow(
        'Title is required and cannot be empty',
      );
      expect(repository.create).not.toHaveBeenCalled();
    });

    it('should throw error if title is only whitespace', async () => {
      await expect(service.createTask('   ')).rejects.toThrow(
        'Title is required and cannot be empty',
      );
      expect(repository.create).not.toHaveBeenCalled();
    });
  });

  describe('getRecentTasks', () => {
    it('should return recent incomplete tasks', async () => {
      const tasks = [
        {
          id: '1',
          title: 'Task 1',
          description: 'Desc 1',
          is_completed: false,
          created_at: new Date(),
        },
        {
          id: '2',
          title: 'Task 2',
          description: 'Desc 2',
          is_completed: false,
          created_at: new Date(),
        },
      ];

      repository.find.mockResolvedValue(tasks as Task[]);

      const result = await service.getRecentTasks();

      expect(result).toEqual(tasks);
      expect(repository.find).toHaveBeenCalledWith({
        where: { is_completed: false },
        order: { created_at: 'DESC' },
        take: 5,
      });
    });

    it('should return empty array when no tasks exist', async () => {
      repository.find.mockResolvedValue([] as Task[]);

      const result = await service.getRecentTasks();

      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalledWith({
        where: { is_completed: false },
        order: { created_at: 'DESC' },
        take: 5,
      });
    });
  });

  describe('markTaskComplete', () => {
    it('should mark a task as complete', async () => {
      const task = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Task',
        description: 'Test Description',
        is_completed: false,
        created_at: new Date(),
      };

      const completedTask = {
        ...task,
        is_completed: true,
      };

      repository.findOne
        .mockResolvedValueOnce(task as Task)
        .mockResolvedValueOnce(completedTask as Task);
      repository.update.mockResolvedValue({ affected: 1 } as any);

      const result = await service.markTaskComplete(task.id);

      expect(result.is_completed).toBe(true);
      expect(repository.findOne).toHaveBeenCalledTimes(2);
      expect(repository.findOne).toHaveBeenNthCalledWith(1, { where: { id: task.id } });
      expect(repository.findOne).toHaveBeenNthCalledWith(2, { where: { id: task.id } });
      expect(repository.update).toHaveBeenCalledWith(task.id, {
        is_completed: true,
      });
    });

    it('should return task as-is if already completed', async () => {
      const task = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Test Task',
        description: 'Test Description',
        is_completed: true,
        created_at: new Date(),
      };

      repository.findOne.mockResolvedValue(task as Task);

      const result = await service.markTaskComplete(task.id);

      expect(result).toEqual(task);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: task.id } });
      expect(repository.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if task does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(
        service.markTaskComplete('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
      expect(repository.update).not.toHaveBeenCalled();
    });
  });
});

