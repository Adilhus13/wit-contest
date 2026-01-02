import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeaderboardTable } from '../components/table/LeaderboardTable';
import { LeaderboardRow } from '../types';

const rows: LeaderboardRow[] = [
  {
    id: 1,
    seasonRank: 1,
    gameRank: 5,
    jersey: 12,
    firstName: 'John',
    lastName: 'Doe',
    pos: 'G',
    ht: "6'2\"",
    wt: 200,
    age: 28,
    exp: 3,
    college: 'U State',
  },
  {
    id: 2,
    seasonRank: 2,
    gameRank: 6,
    jersey: 7,
    firstName: 'Jane',
    lastName: 'Smith',
    pos: 'F',
    ht: "5'9\"",
    wt: 150,
    age: 25,
    exp: 1,
    college: 'College A',
  },
];

test('renders rows and responds to row click and header sort', () => {
  const onSelect = jest.fn();
  const onSortChange = jest.fn();

  render(
    <LeaderboardTable
      rows={rows}
      selectedId={null}
      onSelect={onSelect}
      sort={undefined as any}
      order={'asc' as any}
      onSortChange={onSortChange}
    />
  );

  // Check that first names appear
  expect(screen.getByText('John')).toBeInTheDocument();
  expect(screen.getByText('Jane')).toBeInTheDocument();

  // Click first row -> should call onSelect with id 1
  const firstRow = screen.getByText('John').closest('button');
  expect(firstRow).toBeTruthy();
  fireEvent.click(firstRow!);
  expect(onSelect).toHaveBeenCalledWith(1);

  // Click a sortable header (FIRST NAME header has sortKey 'first_name')
  const firstNameHeader = screen.getByText('FIRST NAME');
  fireEvent.click(firstNameHeader);
  expect(onSortChange).toHaveBeenCalled();
});
