import http, { Server } from 'node:http';
import jwt from 'jsonwebtoken';
import { AddressInfo } from 'node:net';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { Application } from 'express';

process.env.NODE_ENV = 'test';
process.env.SUPABASE_URL = 'https://example.supabase.co';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-role-key';
process.env.SUPABASE_JWT_SECRET = 'test-jwt-secret';

vi.mock('../models/profile.model', () => ({
  getProfileRole: vi.fn(),
}));

vi.mock('../services/profile.service', () => ({
  getPublicProfile: vi.fn(),
  getMyProfile: vi.fn(),
  updateMyProfile: vi.fn(),
  completeOnboarding: vi.fn(),
  uploadMyAvatar: vi.fn(),
}));

vi.mock('../services/card.service', () => ({
  getMyCards: vi.fn(),
  getCardForOwner: vi.fn(),
  createNewCard: vi.fn(),
  updateOwnedCard: vi.fn(),
  deleteOwnedCard: vi.fn(),
  duplicateOwnedCard: vi.fn(),
  publishCard: vi.fn(),
  unpublishCard: vi.fn(),
}));

vi.mock('../services/folder.service', () => ({
  getMyFolders: vi.fn(),
  createMyFolder: vi.fn(),
  renameMyFolder: vi.fn(),
  deleteMyFolder: vi.fn(),
}));

vi.mock('../services/generation.service', () => ({
  runCard: vi.fn(),
}));

import { getProfileRole } from '../models/profile.model';
import * as profileService from '../services/profile.service';
import * as cardService from '../services/card.service';
import * as folderService from '../services/folder.service';
import * as generationService from '../services/generation.service';

const userId = '11111111-1111-4111-8111-111111111111';
const cardId = '22222222-2222-4222-8222-222222222222';
const folderId = '33333333-3333-4333-8333-333333333333';

interface TestResponse {
  status: number;
  headers: http.IncomingHttpHeaders;
  body: unknown;
  text: string;
}

function tokenFor(id = userId) {
  return jwt.sign(
    { sub: id, email: 'user@example.com' },
    process.env.SUPABASE_JWT_SECRET!,
    {
      issuer: `${process.env.SUPABASE_URL}/auth/v1`,
      audience: 'authenticated',
    }
  );
}

function authHeaders() {
  return { authorization: `Bearer ${tokenFor()}` };
}

function listen(app: Application): Promise<Server> {
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, () => resolve(server));
  });
}

function close(server: Server): Promise<void> {
  return new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
}

async function request(
  server: Server,
  method: string,
  path: string,
  options: {
    headers?: Record<string, string>;
    body?: unknown;
    rawBody?: string | Buffer;
  } = {}
): Promise<TestResponse> {
  const { port } = server.address() as AddressInfo;
  const body =
    options.rawBody ??
    (options.body === undefined ? undefined : Buffer.from(JSON.stringify(options.body)));

  const headers: Record<string, string | number> = {
    ...options.headers,
  };

  if (options.body !== undefined) {
    headers['content-type'] = 'application/json';
  }

  if (body !== undefined) {
    headers['content-length'] = Buffer.byteLength(body);
  }

  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port,
        path,
        method,
        headers,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          let parsed: unknown = undefined;
          if (text) {
            try {
              parsed = JSON.parse(text);
            } catch {
              parsed = text;
            }
          }
          resolve({ status: res.statusCode ?? 0, headers: res.headers, body: parsed, text });
        });
      }
    );
    req.on('error', reject);
    if (body !== undefined) {
      req.write(body);
    }
    req.end();
  });
}

describe('API routes', () => {
  let server: Server;

  beforeAll(async () => {
    const { createApp } = await import('../app');
    server = await listen(createApp());
  });

  afterAll(async () => {
    if (server) {
      await close(server);
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getProfileRole).mockResolvedValue('user');
  });

  it('keeps public health checks unauthenticated', async () => {
    const res = await request(server, 'GET', '/api/health');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('rejects protected routes without a Supabase bearer token', async () => {
    const res = await request(server, 'GET', '/api/cards');

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Missing or malformed Authorization header' });
    expect(cardService.getMyCards).not.toHaveBeenCalled();
  });

  it('rejects invalid Supabase JWTs before controllers run', async () => {
    const res = await request(server, 'GET', '/api/profiles/me', {
      headers: { authorization: 'Bearer not-a-valid-token' },
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: 'Invalid or expired token' });
    expect(profileService.getMyProfile).not.toHaveBeenCalled();
  });

  it('routes authenticated card CRUD through owner-scoped services', async () => {
    const createdCard = { id: cardId, title: 'SEO Blog Post' };
    vi.mocked(cardService.getMyCards).mockResolvedValue({ data: [], page: 2, limit: 10 });
    vi.mocked(cardService.createNewCard).mockResolvedValue(createdCard as never);
    vi.mocked(cardService.updateOwnedCard).mockResolvedValue({ id: cardId, title: 'Updated' } as never);
    vi.mocked(cardService.deleteOwnedCard).mockResolvedValue(undefined);

    const listRes = await request(server, 'GET', '/api/cards?page=2&limit=10&search=seo', {
      headers: authHeaders(),
    });
    const createRes = await request(server, 'POST', '/api/cards', {
      headers: authHeaders(),
      body: {
        type: 'text',
        category: 'blog_post',
        title: 'SEO Blog Post',
        prompt_body: 'Write about {{topic}}',
      },
    });
    const updateRes = await request(server, 'PATCH', `/api/cards/${cardId}`, {
      headers: authHeaders(),
      body: { title: 'Updated' },
    });
    const deleteRes = await request(server, 'DELETE', `/api/cards/${cardId}`, {
      headers: authHeaders(),
    });

    expect(listRes.status).toBe(200);
    expect(createRes.status).toBe(201);
    expect(updateRes.status).toBe(200);
    expect(deleteRes.status).toBe(204);
    expect(cardService.getMyCards).toHaveBeenCalledWith(userId, {
      type: undefined,
      category: undefined,
      tag: undefined,
      search: 'seo',
      page: 2,
      limit: 10,
      folderId: undefined,
    });
    expect(cardService.createNewCard).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({
        title: 'SEO Blog Post',
        mode: 'save_only',
        tags: [],
        is_public: false,
      })
    );
    expect(cardService.updateOwnedCard).toHaveBeenCalledWith(cardId, userId, { title: 'Updated' });
    expect(cardService.deleteOwnedCard).toHaveBeenCalledWith(cardId, userId);
  });

  it('blocks invalid card payloads at the API validation boundary', async () => {
    const res = await request(server, 'POST', '/api/cards', {
      headers: authHeaders(),
      body: {
        type: 'text',
        category: '',
        title: 'No',
        prompt_body: '',
      },
    });

    expect(res.status).toBe(400);
    expect(cardService.createNewCard).not.toHaveBeenCalled();
  });

  it('completes onboarding with the authenticated user id', async () => {
    const profile = { id: userId, username: 'new_user', display_name: 'New User' };
    vi.mocked(profileService.completeOnboarding).mockResolvedValue(profile as never);

    const res = await request(server, 'POST', '/api/profiles/complete-onboarding', {
      headers: authHeaders(),
      body: { username: 'new_user', display_name: 'New User' },
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(profile);
    expect(profileService.completeOnboarding).toHaveBeenCalledWith(userId, 'new_user', 'New User');
  });

  it('rejects invalid onboarding usernames before hitting the service', async () => {
    const res = await request(server, 'POST', '/api/profiles/complete-onboarding', {
      headers: authHeaders(),
      body: { username: 'Bad User' },
    });

    expect(res.status).toBe(400);
    expect(profileService.completeOnboarding).not.toHaveBeenCalled();
  });

  it('routes folder create, rename, and delete through owner-scoped services', async () => {
    vi.mocked(folderService.createMyFolder).mockResolvedValue({ id: folderId, name: 'Work' } as never);
    vi.mocked(folderService.renameMyFolder).mockResolvedValue({ id: folderId, name: 'Client Work' } as never);
    vi.mocked(folderService.deleteMyFolder).mockResolvedValue(undefined);

    const createRes = await request(server, 'POST', '/api/folders', {
      headers: authHeaders(),
      body: { name: 'Work' },
    });
    const renameRes = await request(server, 'PATCH', `/api/folders/${folderId}`, {
      headers: authHeaders(),
      body: { name: 'Client Work' },
    });
    const deleteRes = await request(server, 'DELETE', `/api/folders/${folderId}`, {
      headers: authHeaders(),
    });

    expect(createRes.status).toBe(201);
    expect(renameRes.status).toBe(200);
    expect(deleteRes.status).toBe(204);
    expect(folderService.createMyFolder).toHaveBeenCalledWith(userId, 'Work');
    expect(folderService.renameMyFolder).toHaveBeenCalledWith(folderId, userId, 'Client Work');
    expect(folderService.deleteMyFolder).toHaveBeenCalledWith(folderId, userId);
  });

  it('uploads an avatar through multipart form-data and forwards the file metadata', async () => {
    const boundary = '----PromptVaultTestBoundary';
    const avatarBytes = Buffer.from('fake-png-bytes');
    const rawBody = Buffer.concat([
      Buffer.from(
        `--${boundary}\r\n` +
          'Content-Disposition: form-data; name="avatar"; filename="avatar.png"\r\n' +
          'Content-Type: image/png\r\n\r\n'
      ),
      avatarBytes,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]);
    const profile = { id: userId, username: 'new_user', avatar_url: 'https://cdn.example/avatar.png' };
    vi.mocked(profileService.uploadMyAvatar).mockResolvedValue(profile as never);

    const res = await request(server, 'POST', '/api/profiles/me/avatar', {
      headers: {
        ...authHeaders(),
        'content-type': `multipart/form-data; boundary=${boundary}`,
      },
      rawBody,
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(profile);
    expect(profileService.uploadMyAvatar).toHaveBeenCalledWith(
      userId,
      expect.any(Buffer),
      'image/png'
    );
    expect(Buffer.compare(vi.mocked(profileService.uploadMyAvatar).mock.calls[0][1], avatarBytes)).toBe(0);
  });

  it('runs generation only after auth, id validation, and body validation pass', async () => {
    const run = {
      id: '44444444-4444-4444-8444-444444444444',
      card_id: cardId,
      user_id: userId,
      filled_prompt: 'Write about AI',
      result_type: 'text',
      result_value: 'Generated text',
      created_at: '2026-08-05T00:00:00.000Z',
    };
    vi.mocked(generationService.runCard).mockResolvedValue(run as never);

    const okRes = await request(server, 'POST', `/api/cards/${cardId}/run`, {
      headers: authHeaders(),
      body: { values: { topic: 'AI' } },
    });
    const invalidValueRes = await request(server, 'POST', `/api/cards/${cardId}/run`, {
      headers: authHeaders(),
      body: { values: { topic: 42 } },
    });
    const invalidIdRes = await request(server, 'POST', '/api/cards/not-a-uuid/run', {
      headers: authHeaders(),
      body: { values: { topic: 'AI' } },
    });

    expect(okRes.status).toBe(200);
    expect(okRes.body).toEqual(run);
    expect(invalidValueRes.status).toBe(400);
    expect(invalidIdRes.status).toBe(400);
    expect(generationService.runCard).toHaveBeenCalledTimes(1);
    expect(generationService.runCard).toHaveBeenCalledWith(cardId, userId, { topic: 'AI' });
  });
});



