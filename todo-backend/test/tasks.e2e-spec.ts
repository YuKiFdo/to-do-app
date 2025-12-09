import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('TasksController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors({
      origin: true,
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /tasks', () => {
    it('should create a task', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Test Task',
          description: 'Test Description',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Task');
          expect(res.body.description).toBe('Test Description');
          expect(res.body.is_completed).toBe(false);
          expect(res.body).toHaveProperty('created_at');
        });
    });

    it('should create a task without description', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Test Task Only',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.title).toBe('Test Task Only');
          expect(res.body.is_completed).toBe(false);
        });
    });

    it('should fail with empty title', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: '',
        })
        .expect(500);
    });
  });

  describe('GET /tasks', () => {
    it('should return recent incomplete tasks', async () => {
      // Create a few tasks first
      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task 1' });

      await request(app.getHttpServer())
        .post('/tasks')
        .send({ title: 'Task 2' });

      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((task: any) => {
            expect(task).toHaveProperty('id');
            expect(task).toHaveProperty('title');
            expect(task.is_completed).toBe(false);
          });
        });
    });
  });

  describe('PATCH /tasks/:id/complete', () => {
    it('should mark a task as complete', async () => {
      // Create a task first
      const createResponse = await request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'Task to Complete',
          description: 'This will be completed',
        });

      const taskId = createResponse.body.id;

      return request(app.getHttpServer())
        .patch(`/tasks/${taskId}/complete`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(taskId);
          expect(res.body.is_completed).toBe(true);
        });
    });

    it('should return 404 for non-existent task', () => {
      return request(app.getHttpServer())
        .patch('/tasks/00000000-0000-0000-0000-000000000000/complete')
        .expect(404);
    });
  });
});

