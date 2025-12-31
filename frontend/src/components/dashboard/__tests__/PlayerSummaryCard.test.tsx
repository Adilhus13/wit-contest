import React from 'react';
import { render, screen } from '@testing-library/react';
import PlayerSummaryCard from '../PlayerSummaryCard';

const player = {
  id: 1,
  jersey: 10,
  firstName: 'Alice',
  lastName: 'Johnson',
  headshot_url: 'https://example.com/head.jpg',
};

test('renders player details and image alt text', () => {
  render(<PlayerSummaryCard player={player as any} />);

  expect(screen.getByText('Alice')).toBeInTheDocument();
  expect(screen.getByText('Johnson')).toBeInTheDocument();

  const img = screen.getByRole('img') as HTMLImageElement;
  expect(img).toBeInTheDocument();
  expect(img.alt).toBe('Alice Johnson');
  expect(img.src).toBe(player.headshot_url);
});
