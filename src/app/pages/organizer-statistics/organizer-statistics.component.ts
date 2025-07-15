import { Component, OnInit } from '@angular/core';
import { RequestsService } from '../../services/requests.service';
import { ChartConfiguration, ChartOptions } from 'chart.js';

interface StatRecord {
  anno: number;
  mese: number;
  categoria: string;
  numeroRichieste: number;
  totaleCosto: number;
}

@Component({
  selector: 'app-organizer-statistics',
  templateUrl: './organizer-statistics.component.html',
  styleUrls: ['./organizer-statistics.component.scss']
})
export class OrganizerStatisticsComponent implements OnInit {
  stats: StatRecord[] = [];
  error: string | null = null;
  loading = false;
  selectedYear: number = new Date().getFullYear();
  categories: string[] = [];
  monthLabels = [
    'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
    'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'
  ];
  selectedCategory: string = '';
  get filteredCategories() {
    if (!this.selectedCategory) return this.categories;
    return this.categories.filter(c => c === this.selectedCategory);
  }

  chartData: { [cat: string]: ChartConfiguration<'bar'>['data'] } = {};
  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
      tooltip: {
        callbacks: {
          label: function(context) {
            if (context.dataset.label === 'Costo totale') {
              return `${context.dataset.label}: €${context.parsed.y.toLocaleString('it-IT', {minimumFractionDigits: 2})}`;
            }
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Numero richieste' }
      },
      y1: {
        beginAtZero: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'Costo totale (€)' }
      }
    }
  };

  constructor(private requestsService: RequestsService) {}

  ngOnInit() {
    this.loadStats();
  }

  loadStats() {
    this.loading = true;
    this.error = null;
    this.requestsService.getStats(this.selectedYear).subscribe({
      next: (data) => {
        this.stats = data;
        this.categories = Array.from(new Set(data.map(d => d.categoria)));
        this.prepareChartData();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Errore nel caricamento delle statistiche';
        this.loading = false;
      }
    });
  }

  prepareChartData() {
    this.chartData = {};
    for (const cat of this.categories) {
      const catStats = this.stats.filter(s => s.categoria === cat);
      // Array di 12 mesi, default 0
      const richiestePerMese = Array(12).fill(0);
      const costoPerMese = Array(12).fill(0);
      for (const s of catStats) {
        richiestePerMese[s.mese - 1] = s.numeroRichieste;
        costoPerMese[s.mese - 1] = s.totaleCosto;
      }
      this.chartData[cat] = {
        labels: this.monthLabels,
        datasets: [
          {
            label: 'Numero richieste',
            data: richiestePerMese,
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
            yAxisID: 'y',
          },
          {
            label: 'Costo totale',
            data: costoPerMese,
            backgroundColor: 'rgba(255, 159, 64, 0.7)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1,
            yAxisID: 'y1',
          }
        ]
      };
    }
  }

  getStatsForCategory(cat: string) {
    return this.stats.filter(x => x.categoria === cat);
  }

  getMonthName(mese: number): string {
    return this.monthLabels[mese - 1] || '';
  }
} 