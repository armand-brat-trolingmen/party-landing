import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';

vi.mock('@vercel/speed-insights/react', () => ({
  SpeedInsights: () => <div data-testid="vercel-speed-insights" />,
}));

import App from './App';

test('does not mount Vercel Speed Insights on local hosts', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );

  expect(screen.queryByTestId('vercel-speed-insights')).not.toBeInTheDocument();
});
