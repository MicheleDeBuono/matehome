# MATE HOME 2

Un sistema avanzato di monitoraggio assistenziale per anziani e persone che necessitano di supervisione costante.

## Caratteristiche Principali

- **Monitoraggio Non Invasivo**: Utilizzo di sensori UWB per il rilevamento della presenza e del movimento
- **Notifiche in Tempo Reale**: Sistema intelligente di notifiche per eventi significativi
- **Dashboard Intuitiva**: Interfaccia user-friendly per una rapida visualizzazione dello stato
- **Privacy Preservata**: Nessuna telecamera o dispositivo invasivo

## App Mobile

L'applicazione mobile è sviluppata con React Native e offre:
- Monitoraggio in tempo reale
- Gestione notifiche
- Statistiche e report
- Configurazione dispositivi

## Tecnologie Utilizzate

- **Frontend**: React Native, TypeScript, Redux
- **Backend**: Node.js, Express, PostgreSQL
- **Infrastruttura**: AWS, Docker, Kubernetes
- **Monitoraggio**: ELK Stack, Prometheus

## Documentazione

La documentazione completa del progetto è disponibile nella cartella `docs/`:
- Analisi Funzionale Dettagliata
- Diagrammi di Architettura
- Specifiche Tecniche

## Getting Started

1. Clona il repository
```bash
git clone https://github.com/MicheleDeBuono/matehome.git
```

2. Installa le dipendenze
```bash
cd matehome
npm install
```

3. Avvia l'app in modalità sviluppo
```bash
npm start
```

## Struttura del Progetto

```
mate-home-2/
├── docs/               # Documentazione
├── src/               # Codice sorgente
│   ├── components/    # Componenti React
│   ├── screens/       # Schermate dell'app
│   ├── services/      # Servizi e API
│   └── navigation/    # Configurazione navigazione
└── App.js            # Entry point
```

## Contributing

Le contribuzioni sono benvenute! Per favore, leggi le linee guida per contribuire prima di iniziare.

## License

Questo progetto è sotto licenza MIT - vedi il file LICENSE per i dettagli.
