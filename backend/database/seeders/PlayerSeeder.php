<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Player;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class PlayerSeeder extends Seeder
{
    public function run(): void
    {
        $path = database_path('seeders/data/49ers_players.csv');
        if (!File::exists($path)) {
            throw new \RuntimeException("Missing roster file: {$path}");
        }

        $lines = array_map('trim', file($path));
        if (count($lines) < 2) {
            throw new \RuntimeException("Roster file is empty or invalid: {$path}");
        }
        $header = str_getcsv(array_shift($lines));
        $required = ['first_name','last_name','jersey_number','position','status'];
        foreach ($required as $col) {
            if (! in_array($col, $header, true)) {
                throw new \RuntimeException("Roster CSV missing required column: {$col}");
            }
        }

        foreach ($required as $col) {
            if (! in_array($col, $header, true)) {
                throw new \RuntimeException("Roster CSV missing required column: {$col}");
            }
        }

        foreach ($lines as $line) {
            if ($line === '') continue;

            $row = array_combine($header, str_getcsv($line));
            if (! $row) continue;

            Player::updateOrCreate(
                ['jersey_number' => (int) $row['jersey_number']],
                [
                    'first_name' => trim($row['first_name']),
                    'last_name' => trim($row['last_name']),
                    'position' => strtoupper(trim($row['position'])),
                    'status' => in_array($row['status'], ['active','inactive'], true) ? $row['status'] : 'active',

                    'age' => ($row['age'] ?? '') !== '' ? (int) $row['age'] : null,
                    'height_in' => ($row['height_in'] ?? '') !== '' ? (int) $row['height_in'] : null,
                    'weight_lb' => ($row['weight_lb'] ?? '') !== '' ? (int) $row['weight_lb'] : null,
                    'experience_years' => ($row['experience_years'] ?? '') !== '' ? (int) $row['experience_years'] : null,

                    'college' => isset($row['college']) && trim($row['college']) !== '' ? trim($row['college']) : null,
                ]
            );
        }
    }
}
