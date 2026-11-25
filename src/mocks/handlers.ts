import { delay, http, HttpResponse } from 'msw';
import type { BenefitType, MerchantCategory } from '@/api/types';
import { DEMO_PASSWORD, demoUser, merchants, transactions, wallets } from './data';

const DEMO_TOKEN = 'demo-token';

/** Latence réaliste en dev, nulle en test. */
const latency = () => delay(typeof process !== 'undefined' && process.env.NODE_ENV === 'test' ? 0 : 400);

const unauthorized = () =>
  HttpResponse.json({ code: 'UNAUTHORIZED', message: 'Session expirée' }, { status: 401 });

const isAuthed = (request: Request) => request.headers.get('Authorization') === `Bearer ${DEMO_TOKEN}`;

export const handlers = [
  http.post('/api/auth/login', async ({ request }) => {
    await latency();
    const { email, password } = (await request.json()) as { email: string; password: string };
    if (email !== demoUser.email || password !== DEMO_PASSWORD) {
      return HttpResponse.json({ code: 'INVALID_CREDENTIALS', message: 'Identifiants incorrects' }, { status: 401 });
    }
    return HttpResponse.json({ token: DEMO_TOKEN, user: demoUser });
  }),

  http.get('/api/me', async ({ request }) => {
    await latency();
    if (!isAuthed(request)) return unauthorized();
    return HttpResponse.json(demoUser);
  }),

  http.get('/api/wallets', async ({ request }) => {
    await latency();
    if (!isAuthed(request)) return unauthorized();
    return HttpResponse.json(wallets);
  }),

  // GET /api/transactions?benefit=meal&kind=debit&page=1&pageSize=10
  http.get('/api/transactions', async ({ request }) => {
    await latency();
    if (!isAuthed(request)) return unauthorized();
    const url = new URL(request.url);
    const benefit = url.searchParams.get('benefit') as BenefitType | null;
    const kind = url.searchParams.get('kind');
    const page = Number(url.searchParams.get('page') ?? 1);
    const pageSize = Number(url.searchParams.get('pageSize') ?? 10);

    const filtered = transactions.filter(
      (t) => (!benefit || t.benefit === benefit) && (!kind || t.kind === kind),
    );
    return HttpResponse.json({
      items: filtered.slice((page - 1) * pageSize, page * pageSize),
      page,
      pageSize,
      total: filtered.length,
    });
  }),

  // GET /api/merchants?q=bistrot&category=restaurant&benefit=meal&sort=distance
  http.get('/api/merchants', async ({ request }) => {
    await latency();
    if (!isAuthed(request)) return unauthorized();
    const url = new URL(request.url);
    const q = url.searchParams.get('q')?.toLowerCase().trim();
    const category = url.searchParams.get('category') as MerchantCategory | null;
    const benefit = url.searchParams.get('benefit') as BenefitType | null;
    const sort = url.searchParams.get('sort') ?? 'distance';

    const items = merchants
      .filter((m) => !q || m.name.toLowerCase().includes(q) || m.city.toLowerCase().includes(q))
      .filter((m) => !category || m.category === category)
      .filter((m) => !benefit || m.acceptedBenefits.includes(benefit))
      .sort((a, b) => (sort === 'rating' ? b.rating - a.rating : a.distance - b.distance));
    return HttpResponse.json(items);
  }),

  http.get('/api/merchants/:id', async ({ request, params }) => {
    await latency();
    if (!isAuthed(request)) return unauthorized();
    const merchant = merchants.find((m) => m.id === params.id);
    if (!merchant) return HttpResponse.json({ code: 'NOT_FOUND', message: 'Commerçant introuvable' }, { status: 404 });
    return HttpResponse.json(merchant);
  }),
];
