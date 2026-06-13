import { widgetApi } from '@/app/services/widget-api';
import { query as queryWidget } from '@/client';
import { auth } from '@/app/lib/firebase';

jest.mock('@/client', () => ({
  query: jest.fn(),
  updateWidget: jest.fn(),
  refreshWidget: jest.fn(),
}));

describe('widgetApi.query', () => {
  beforeEach(() => {
    (queryWidget as jest.Mock).mockClear();
    (auth as any).currentUser = null;
    sessionStorage.clear();
  });

  it('formats query by removing newlines', async () => {
    (queryWidget as jest.Mock).mockResolvedValue({ data: {} });
    await widgetApi.query('SELECT *\nFROM test');
    expect(queryWidget).toHaveBeenCalledWith({
      client: expect.anything(),
      body: { query: 'SELECT * FROM test' },
      headers: undefined,
    });
  });
  it('adds auth header when token is stored', async () => {
    sessionStorage.setItem('auth-token', 'abc');
    (queryWidget as jest.Mock).mockResolvedValue({ data: {} });
    await widgetApi.query('select 1');
    expect(queryWidget).toHaveBeenCalledWith({
      client: expect.anything(),
      body: { query: 'select 1' },
      headers: { Authorization: 'Bearer abc' },
    });
  });
});
