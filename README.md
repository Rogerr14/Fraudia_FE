# Fraudia FE

Frontend Angular para el MVP **Detector de Posibles Fraudes en Siniestros usando Inteligencia Artificial**.

## Stack

- Angular 17 con standalone components.
- TypeScript estricto.
- SCSS mobile first.
- Angular Router, Reactive Forms, HttpClient y RxJS.
- Interceptores para autenticación, errores y loading.
- Arquitectura por capas: `core`, `shared` y `features`.

## Instalación

```bash
npm install
```

## Ejecución

```bash
npm run start
npm run start:dev
npm run start:test
```

## Build

```bash
npm run build
npm run build:prod
```

## Ambientes

Los ambientes están en `src/environments`:

- `environment.development.ts`: `http://localhost:8000/api/v1`
- `environment.test.ts`: `https://test-api.example.com/api/v1`
- `environment.production.ts`: `https://api.example.com/api/v1`

Las URLs no están quemadas en servicios. Todos los servicios usan `HttpClientService` y `environment.apiBaseUrl`.

## Endpoints FastAPI consumidos

- `POST /imports/file`
- `GET /claims`
- `GET /claims/{claim_id}`
- `POST /claims/{claim_id}/assess`
- `GET /risk/top`
- `GET /analytics/summary`
- `GET /analytics/providers`
- `GET /analytics/alerts`
- `POST /agent/query`

Las reglas de evaluación se muestran desde una fuente local tipada porque el backend entregado no expone un endpoint de reglas. La revisión humana se guarda en `localStorage` para mantener el flujo completo del MVP mientras se agrega el endpoint correspondiente.
