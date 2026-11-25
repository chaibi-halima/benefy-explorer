import '@testing-library/jest-dom';
import { server } from '@/mocks/server';
import { useAuthStore } from '@/features/auth/authStore';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
  useAuthStore.setState({ token: null, user: null });
});
afterAll(() => server.close());
