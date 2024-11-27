<template>
    <div class="p-4 max-w-7xl mx-auto">
      <!-- Header con titolo e sommario -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-primary mb-2">Registro degli Accessi</h1>
        <p class="text-gray-600">Monitoraggio degli accessi in tempo reale</p>
      </div>
  
      <!-- Cards delle statistiche -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="stats shadow bg-base-100">
          <div class="stat">
            <div class="stat-title">Accessi Totali</div>
            <div class="stat-value text-primary">{{ statistics.totalAccesses }}</div>
          </div>
        </div>
        
        <div class="stats shadow bg-base-100">
          <div class="stat">
            <div class="stat-title">Accessi Autorizzati</div>
            <div class="stat-value text-success">{{ statistics.grantedAccesses }}</div>
          </div>
        </div>
  
        <div class="stats shadow bg-base-100">
          <div class="stat">
            <div class="stat-title">Accessi Negati</div>
            <div class="stat-value text-error">{{ statistics.deniedAccesses }}</div>
          </div>
        </div>
  
        <div class="stats shadow bg-base-100">
          <div class="stat">
            <div class="stat-title">Utenti Unici</div>
            <div class="stat-value text-info">{{ statistics.uniqueUsers }}</div>
          </div>
        </div>
      </div>
  
      <!-- Tabella degli accessi -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="overflow-x-auto">
            <table class="table table-zebra">
              <thead>
                <tr>
                  <th class="bg-base-200">Utente</th>
                  <th class="bg-base-200">Codice RFID</th>
                  <th class="bg-base-200">Data e Ora</th>
                  <th class="bg-base-200">Stato</th>
                  <th class="bg-base-200">Motivo Rifiuto</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in accessLogs" :key="log.id" class="hover">
                  <td>
                    <div class="flex items-center space-x-3">
                      <div class="avatar placeholder">
                        <div class="bg-neutral text-neutral-content rounded-full w-8">
                          <span>{{ getInitials(log?.user?.name) }}</span>
                        </div>
                      </div>
                      <div>
                        <div class="font-bold">{{ log?.user?.name || 'N/A' }}</div>
                        <div class="text-sm opacity-50">{{ log?.user?.email }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="badge badge-ghost">{{ log?.rfidToken?.rfidCode || 'N/A' }}</div>
                  </td>
                  <td>{{ formatDate(log?.accessTime) }}</td>
                  <td>
                    <div :class="`badge ${log.isGranted ? 'badge-success' : 'badge-error'} gap-2`">
                      {{ log?.isGranted ? "Autorizzato" : "Non Autorizzato" }}
                    </div>
                  </td>
                  <td>
                    <span v-if="log.deniedReason" class="text-error">
                      {{ log.deniedReason }}
                    </span>
                    <span v-else>-</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <!-- Paginazione -->
          <div class="flex justify-between items-center mt-4">
            <div class="text-sm text-gray-600">
              Mostrando pagina {{ pagination.currentPage }} di {{ pagination.totalPages }}
            </div>
            <div class="join">
              <button 
                class="join-item btn btn-sm"
                :disabled="pagination.currentPage === 1"
                @click="changePage(pagination.currentPage - 1)"
              >
                «
              </button>
              <button class="join-item btn btn-sm">
                Pagina {{ pagination.currentPage }}
              </button>
              <button 
                class="join-item btn btn-sm"
                :disabled="pagination.currentPage === pagination.totalPages"
                @click="changePage(pagination.currentPage + 1)"
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import apiClient from "../services/api";
  
  export default {
    name: 'AccessLogs',
    data() {
      return {
        accessLogs: [],
        pagination: {
          currentPage: 1,
          pageSize: 50,
          totalItems: 0,
          totalPages: 1
        },
        statistics: {
          totalAccesses: 0,
          grantedAccesses: 0,
          deniedAccesses: 0,
          uniqueUsers: 0
        }
      };
    },
    mounted() {
      this.fetchAccessLogs();
    },
    methods: {
      async fetchAccessLogs(page = 1) {
        try {
          const response = await apiClient.get(`/AccessLogs?page=${page}`);
          if (response.data) {
            this.accessLogs = response.data.logs;
            this.pagination = response.data.pagination;
            this.statistics = response.data.statistics;
          }
        } catch (error) {
          console.error("Errore nel recupero dei log:", error);
        }
      },
      formatDate(dateString) {
        if (!dateString) return 'Data non disponibile';
        const date = new Date(dateString);
        return date.toLocaleString('it-IT', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      },
      getInitials(name) {
        return name
          ? name
              .split(' ')
              .map(word => word[0])
              .join('')
              .toUpperCase()
          : 'NA';
      },
      async changePage(newPage) {
        if (newPage >= 1 && newPage <= this.pagination.totalPages) {
          await this.fetchAccessLogs(newPage);
        }
      }
    }
  };
  </script>