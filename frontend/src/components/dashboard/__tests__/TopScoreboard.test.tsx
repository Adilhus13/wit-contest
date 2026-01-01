import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import TopScoreboard from '../../scoreboard/components/TopScoreboard';

jest.mock('@/lib/api', () => ({
  apiGet: jest.fn(),
  getToken: jest.fn(),
}));

import { apiGet, getToken } from '@/components/scoreboard/api';

test('fetches and displays games', async () => {
  (getToken as jest.Mock).mockResolvedValue('token-123');

  const games = [
    {
      id: 1,
      date: '2025-01-01',
      stadium: 'Stadium A',
      opponentCity: 'Opponent City',
      opponentName: 'Opponent Name',
      result: 'W',
      score: '24-17',
      logo_url: 'https://example.com/logo.png',
    },
  ];

  (apiGet as jest.Mock).mockResolvedValue({ data: games });

  render(<TopScoreboard />);

  // wait for opponent name to appear
  await waitFor(() => expect(screen.getByText('Opponent Name')).toBeInTheDocument());

  expect(screen.getByText('2025-01-01')).toBeInTheDocument();
  expect(screen.getByText('Stadium A')).toBeInTheDocument();
  expect(screen.getByText('Opponent City')).toBeInTheDocument();
});
