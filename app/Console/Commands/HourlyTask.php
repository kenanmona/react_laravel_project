<?php

namespace App\Console\Commands;

use App\Models\Skill;
use Illuminate\Console\Command;

class HourlyTask extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'hourlyTask';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Delete Task Every min';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        Skill::first()->delete();

    }
}
