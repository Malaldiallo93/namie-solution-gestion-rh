<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class LeavePeriod extends Model
{
    use HasFactory;

    protected $fillable = [
        'year',
        'start_date',
        'end_date',
        'summer_period_start',
        'summer_period_end',
        'min_summer_days',
        'is_active',
        'company_closures',
        'public_holidays',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'summer_period_start' => 'date',
        'summer_period_end' => 'date',
        'is_active' => 'boolean',
        'company_closures' => 'array',
        'public_holidays' => 'array',
    ];

    /**
     * Créer une période de référence selon les règles Namie
     */
    public static function createPeriod(int $year): self
    {
        return self::create([
            'year' => $year,
            'start_date' => Carbon::create($year, 6, 1), // 1er juin
            'end_date' => Carbon::create($year + 1, 5, 31), // 31 mai année suivante
            'summer_period_start' => Carbon::create($year, 7, 1), // 1er juillet
            'summer_period_end' => Carbon::create($year, 8, 31), // 31 août
            'min_summer_days' => 14, // 2 semaines minimum
            'is_active' => true,
            'public_holidays' => self::getFrenchPublicHolidays($year),
        ]);
    }

    /**
     * Obtenir la période active pour une date donnée
     */
    public static function getActivePeriod(?Carbon $date = null): ?self
    {
        $date = $date ?? now();
        
        return self::where('is_active', true)
                   ->where('start_date', '<=', $date)
                   ->where('end_date', '>=', $date)
                   ->first();
    }

    /**
     * Obtenir la période pour une année donnée
     */
    public static function getPeriodForYear(int $year): ?self
    {
        return self::where('year', $year)->first();
    }

    /**
     * Vérifier si une date est dans la période d'été obligatoire
     */
    public function isInSummerPeriod(Carbon $date): bool
    {
        return $date->between($this->summer_period_start, $this->summer_period_end);
    }

    /**
     * Calculer les jours ouvrés entre deux dates
     */
    public function getWorkingDaysBetween(Carbon $startDate, Carbon $endDate): int
    {
        $workingDays = 0;
        $current = $startDate->copy();
        $publicHolidays = collect($this->public_holidays ?? [])->map(fn($h) => Carbon::parse($h));
        
        while ($current <= $endDate) {
            // Exclure weekends et jours fériés
            if (!$current->isWeekend() && !$publicHolidays->contains(fn($h) => $h->isSameDay($current))) {
                $workingDays++;
            }
            $current->addDay();
        }
        
        return $workingDays;
    }

    /**
     * Vérifier si une période de congés respecte les règles
     */
    public function validateLeavePeriod(Carbon $startDate, Carbon $endDate, string $leaveType): array
    {
        $errors = [];
        $warnings = [];

        // Vérifier que les dates sont dans cette période
        if (!$startDate->between($this->start_date, $this->end_date) ||
            !$endDate->between($this->start_date, $this->end_date)) {
            
            if ($startDate->lt($this->start_date) || $endDate->gt($this->end_date)) {
                $warnings[] = "Les congés s'étendent sur plusieurs périodes de référence";
            }
        }

        // Pour les congés payés, vérifier les restrictions d'été
        if ($leaveType === 'annual') {
            $summerOverlap = $this->getSummerOverlap($startDate, $endDate);
            if ($summerOverlap > 0) {
                $warnings[] = "Ces congés incluent {$summerOverlap} jours de la période d'été obligatoire";
            }
        }

        // Vérifier les fermetures d'entreprise
        if ($this->company_closures) {
            foreach ($this->company_closures as $closure) {
                $closureStart = Carbon::parse($closure['start']);
                $closureEnd = Carbon::parse($closure['end']);
                
                if ($startDate->between($closureStart, $closureEnd) ||
                    $endDate->between($closureStart, $closureEnd)) {
                    $warnings[] = "Congés pendant une fermeture d'entreprise: {$closure['reason']}";
                }
            }
        }

        return [
            'errors' => $errors,
            'warnings' => $warnings,
        ];
    }

    /**
     * Calculer le chevauchement avec la période d'été
     */
    private function getSummerOverlap(Carbon $startDate, Carbon $endDate): int
    {
        $summerStart = $this->summer_period_start;
        $summerEnd = $this->summer_period_end;
        
        $overlapStart = $startDate->max($summerStart);
        $overlapEnd = $endDate->min($summerEnd);
        
        if ($overlapStart <= $overlapEnd) {
            return $this->getWorkingDaysBetween($overlapStart, $overlapEnd);
        }
        
        return 0;
    }

    /**
     * Obtenir les jours fériés français pour une année
     */
    private static function getFrenchPublicHolidays(int $year): array
    {
        $holidays = [];
        
        // Jours fériés fixes
        $fixedHolidays = [
            'Jour de l\'An' => "{$year}-01-01",
            'Fête du Travail' => "{$year}-05-01",
            'Fête de la Victoire' => "{$year}-05-08",
            'Fête Nationale' => "{$year}-07-14",
            'Assomption' => "{$year}-08-15",
            'Toussaint' => "{$year}-11-01",
            'Armistice' => "{$year}-11-11",
            'Noël' => "{$year}-12-25",
        ];
        
        // Jours fériés variables (basés sur Pâques)
        $easter = Carbon::createFromDate($year, 3, 21)->addDays(easter_days($year));
        $variableHolidays = [
            'Lundi de Pâques' => $easter->copy()->addDay()->toDateString(),
            'Ascension' => $easter->copy()->addDays(39)->toDateString(),
            'Lundi de Pentecôte' => $easter->copy()->addDays(50)->toDateString(),
        ];
        
        return array_merge($fixedHolidays, $variableHolidays);
    }

    /**
     * Initialiser les périodes par défaut
     */
    public static function initializeDefaultPeriods(): void
    {
        $currentYear = now()->year;
        
        // Créer les périodes pour l'année courante et suivante
        for ($year = $currentYear - 1; $year <= $currentYear + 1; $year++) {
            if (!self::where('year', $year)->exists()) {
                self::createPeriod($year);
            }
        }
    }

    /**
     * Scope pour les périodes actives
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope pour l'année courante
     */
    public function scopeCurrentYear($query)
    {
        $currentYear = now()->month >= 6 ? now()->year : now()->year - 1;
        return $query->where('year', $currentYear);
    }

    /**
     * Accesseur pour savoir si c'est la période courante
     */
    public function getIsCurrentAttribute(): bool
    {
        $now = now();
        return $now->between($this->start_date, $this->end_date);
    }

    /**
     * Accesseur pour le nom de la période
     */
    public function getPeriodNameAttribute(): string
    {
        return "Période {$this->year}-" . ($this->year + 1);
    }
}
