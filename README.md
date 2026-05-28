# 🚨 Fraudia - Detector de Posibles Fraudes en Siniestros usando Inteligencia Artificial

## Descripción del Proyecto

**Fraudia** es una plataforma web moderna de detección de fraudes en reclamaciones de seguros que utiliza inteligencia artificial y análisis de reglas de negocio para identificar posibles fraudes. Está diseñado como un MVP para un hackathon con arquitectura escalable y componentes reutilizables.

### Características Principales

- 🎯 **Dashboard Interactivo**: Métricas en tiempo real, distribución de riesgos y tendencias
- 📤 **Carga de Datasets**: Soporte para carga masiva de archivos CSV con validación y evaluación por lotes
- 📋 **Gestión de Siniestros**: Listado, búsqueda, filtrado y evaluación individual de reclamaciones
- 🔍 **Detalle Completo**: Vista detallada de siniestros con puntuaciones, alertas e historial de revisiones
- 📏 **Reglas de Negocio**: Configuración y visualización de reglas y sus condiciones
- 🤖 **Agente IA**: Chat interactivo con agente inteligente para consultas sobre reclamaciones
- 📊 **Reportes**: Generación de reportes ejecutivos y casos críticos exportables
- 📱 **Diseño Responsive**: Interfaz mobile-first que se adapta a cualquier dispositivo
- 🌍 **Multiidioma Base**: UI en español con lógica preparada para internacionalización

---

## 📋 Stack Técnico

### Frontend

- **Framework**: Angular 17+ (Standalone Components)
- **Lenguaje**: TypeScript 5.4+
- **Styling**: TailwindCSS 3.3+
- **HTTP Client**: Angular HttpClient con Interceptores
- **State Management**: Angular Signals
- **Animations**: Angular Animations
- **Reactivity**: RxJS 7.8+

### Herramientas de Desarrollo

- **Node Package Manager**: npm
- **Build Tool**: Angular CLI 17+
- **CSS Processing**: PostCSS, Autoprefixer

### Backend Integration

- **Base URL**: Configurable por ambiente (desarrollo/test/producción)
- **API Version**: v1
- **Protocolo**: REST/HTTP

---

## 🚀 Instalación

### Requisitos Previos

- **Node.js** 18+ y npm 9+ (o superior)
- **Angular CLI** 17+ (instalable globalmente)

### Pasos de Instalación

1. **Clonar o extraer el repositorio**
   ```bash
   cd Fraudia_FE
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Verificar instalación**
   ```bash
   ng version
   ```

---

## ⚙️ Configuración de Ambientes

El proyecto soporta 3 ambientes: **development**, **test** y **production**.

### Archivo: `src/environments/environment.ts`

Actualizar según la URL de tu API:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000/api/v1',
  appEnv: 'development'
};
```

### Ambientes Disponibles

| Ambiente | Comando | Base URL | Configuración |
|----------|---------|----------|----------------|
| **Development** | `npm run start:dev` | `http://localhost:8000/api/v1` | `environment.development.ts` |
| **Test** | `npm run start:test` | `https://test-api.example.com/api/v1` | `environment.test.ts` |
| **Production** | `npm run build:prod` | `https://api.example.com/api/v1` | `environment.production.ts` |

### Configurar URL de Backend

Editar el archivo correspondiente al ambiente y actualizar `apiBaseUrl`:

```typescript
// Para development
apiBaseUrl: 'http://tu-ip-backend:8000/api/v1'
```

---

## 🏃 Ejecución

### Servidor de Desarrollo

**Iniciar en ambiente de desarrollo:**
```bash
npm run start:dev
```

**Iniciar en ambiente de test:**
```bash
npm run start:test
```

**Iniciar en ambiente por defecto:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:4200`

### Compilar para Producción

**Build optimizado:**
```bash
npm run build:prod
```

Los archivos compilados se guardarán en la carpeta `dist/fraudia-fe`

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── core/                          # Servicios centrales y configuración
│   │   ├── api/                       # Definiciones de endpoints
│   │   │   └── api-endpoints.ts       # URLs de API centralizadas
│   │   ├── interceptors/              # HTTP Interceptors
│   │   │   ├── error.interceptor.ts   # Manejo de errores HTTP
│   │   │   └── loading.interceptor.ts # Estado de carga global
│   │   ├── layout/                    # Componentes de layout
│   │   │   ├── main-layout.component.ts
│   │   │   ├── sidebar.component.ts
│   │   │   ├── topbar.component.ts
│   │   │   └── mobile-nav.component.ts
│   │   └── services/                  # Servicios core
│   │       ├── http-client.service.ts
│   │       ├── loading.service.ts
│   │       ├── notification.service.ts
│   │       └── environment.service.ts
│   │
│   ├── shared/                        # Componentes y utilities compartidos
│   │   ├── components/                # UI Components reutilizables
│   │   │   ├── app-button.component.ts
│   │   │   ├── app-card.component.ts
│   │   │   ├── app-badge.component.ts
│   │   │   ├── risk-badge.component.ts
│   │   │   ├── loading-spinner.component.ts
│   │   │   ├── empty-state.component.ts
│   │   │   ├── score-card.component.ts
│   │   │   ├── app-modal.component.ts
│   │   │   ├── file-upload.component.ts
│   │   │   └── app-table.component.ts
│   │   ├── pipes/                     # Angular Pipes
│   │   │   ├── currency-format.pipe.ts
│   │   │   ├── date-format.pipe.ts
│   │   │   └── risk-level.pipe.ts
│   │   └── utils/                     # Funciones utilitarias
│   │       ├── format.util.ts
│   │       └── risk.util.ts
│   │
│   ├── features/                      # Módulos de funcionalidades
│   │   ├── dashboard/
│   │   │   ├── pages/
│   │   │   │   └── dashboard-page.component.ts
│   │   │   ├── components/
│   │   │   │   ├── summary-cards.component.ts
│   │   │   │   ├── risk-distribution.component.ts
│   │   │   │   ├── top-risk-claims.component.ts
│   │   │   │   ├── providers-ranking.component.ts
│   │   │   │   └── cities-alerts.component.ts
│   │   │   └── services/
│   │   │       └── dashboard.service.ts
│   │   │
│   │   ├── uploads/
│   │   │   ├── pages/
│   │   │   │   └── upload-dataset-page.component.ts
│   │   │   └── services/
│   │   │       └── upload.service.ts
│   │   │
│   │   ├── claims/
│   │   │   ├── pages/
│   │   │   │   ├── claims-list-page.component.ts
│   │   │   │   └── claim-detail-page.component.ts
│   │   │   └── services/
│   │   │       └── claims.service.ts
│   │   │
│   │   ├── rules/
│   │   │   ├── pages/
│   │   │   │   └── rules-page.component.ts
│   │   │   └── services/
│   │   │       └── rules.service.ts
│   │   │
│   │   ├── agent/
│   │   │   ├── pages/
│   │   │   │   └── agent-chat-page.component.ts
│   │   │   └── services/
│   │   │       └── agent.service.ts
│   │   │
│   │   ├── reports/
│   │   │   ├── pages/
│   │   │   │   └── reports-page.component.ts
│   │   │   └── services/
│   │   │       └── reports.service.ts
│   │   │
│   │   └── models/                    # Interfaces TypeScript
│   │       ├── claim.model.ts
│   │       ├── rule.model.ts
│   │       ├── upload.model.ts
│   │       ├── dashboard.model.ts
│   │       ├── agent.model.ts
│   │       ├── report.model.ts
│   │       ├── scoring.model.ts
│   │       └── api.model.ts
│   │
│   ├── app.routes.ts                  # Configuración de rutas
│   ├── app.config.ts                  # Configuración de aplicación
│   └── app.component.ts               # Componente raíz
│
├── environments/                      # Configuraciones por ambiente
│   ├── environment.ts
│   ├── environment.development.ts
│   ├── environment.test.ts
│   └── environment.production.ts
│
├── styles.scss                        # Estilos globales (Tailwind)
├── main.ts                            # Punto de entrada
└── index.html                         # HTML principal
```

---

## 🔌 Integración con Backend

### API Base

La aplicación se conecta con un backend FastAPI en el endpoint `/api/v1`. El backend debe tener habilitado **CORS** para que el frontend pueda hacer solicitudes.

### Endpoints Utilizados

El frontend consume los siguientes grupos de endpoints:

#### 1. **Health Check**
- `GET /health` - Verificar estado del backend

#### 2. **Carga de Datos**
- `POST /uploads/dataset` - Cargar archivo CSV
- `GET /uploads/{batch_id}/status` - Verificar estado de carga

#### 3. **Siniestros**
- `GET /siniestros` - Listado paginado de siniestros
- `GET /siniestros/{id}` - Detalle de siniestro
- `POST /siniestros` - Crear nuevo siniestro
- `PUT /siniestros/{id}` - Actualizar siniestro
- `POST /siniestros/{id}/evaluate` - Evaluar un siniestro
- `GET /siniestros/{id}/score` - Obtener puntuación
- `GET /siniestros/{id}/alerts` - Obtener alertas
- `POST /siniestros/{id}/review` - Enviar revisión
- `GET /siniestros/{id}/review-history` - Historial de revisiones

#### 4. **Scoring**
- `POST /scoring/evaluate-batch` - Evaluar múltiples siniestros

#### 5. **Dashboard**
- `GET /dashboard/summary` - Resumen de métricas
- `GET /dashboard/risk-distribution` - Distribución de riesgos
- `GET /dashboard/top-risks` - Top 10 riesgos
- `GET /dashboard/providers-ranking` - Ranking de aseguradoras
- `GET /dashboard/cities-alerts` - Alertas por ciudad
- `GET /dashboard/branches-risk` - Riesgo por rama

#### 6. **Reglas**
- `GET /rules` - Listado de reglas
- `GET /rules/{id}` - Detalle de regla con condiciones

#### 7. **Agente IA**
- `POST /agent/query` - Consultar agente
- `POST /agent/explain-claim` - Explicar decisión de siniestro
- `GET /agent/suggested-questions` - Preguntas sugeridas

#### 8. **Reportes**
- `GET /reports/critical-cases` - Casos críticos
- `GET /reports/executive-summary` - Resumen ejecutivo

### Autenticación

Actualmente **sin autenticación**. Para agregar autenticación:

1. Crear `auth.service.ts`
2. Agregar `AuthInterceptor` en `app.config.ts`
3. Guardar token en `localStorage` o `sessionStorage`

---

## 🎨 Funcionalidades Principales

### 1. Dashboard
- Métricas generales (total siniestros, evaluados, promedio score)
- Gráficos de distribución de riesgo (Verde/Amarillo/Rojo)
- Top 10 siniestros de alto riesgo
- Ranking de aseguradoras por cantidad de alertas
- Alertas por ciudad/sucursal

### 2. Carga de Datasets
- Validación de archivos (CSV, máximo 50MB)
- Carga masiva con feedback en tiempo real
- Evaluación automática por lotes
- Tabla de errores con detalle

### 3. Gestión de Siniestros
- Listado con paginación (10, 20, 50 por página)
- Filtros: Nivel de riesgo, Ramo, Ciudad
- Vista detallada con todas las secciones
- Revisión de siniestros con formulario
- Historial de cambios

### 4. Evaluación de Siniestros
- Puntuación automática (0-100)
- Componentes: Reglas, IA, NLP
- Recomendación (Aceptar/Rechazar/Revisar)
- Alertas detalladas

### 5. Reglas de Negocio
- Visualización de todas las reglas
- Condiciones anidadas
- Estado activo/inactivo
- Puntuación por regla

### 6. Agente IA
- Chat interactivo
- Preguntas sugeridas
- Contexto de siniestro
- Explicaciones de decisiones

### 7. Reportes
- Resumen ejecutivo con métricas
- Casos críticos con motivos
- Recomendaciones por caso
- Exportar a JSON/CSV

---

## 🛠️ Desarrollo

### Agregar Nuevas Rutas

1. Crear componente página en `features/[feature]/pages/`
2. Crear servicio en `features/[feature]/services/` si es necesario
3. Agregar ruta en `app.routes.ts`
4. Crear menú en `sidebar.component.ts`

### Agregar Nuevos Componentes UI

1. Crear en `shared/components/`
2. Usar Tailwind classes
3. Exportar desde componente
4. Importar donde sea necesario

### Agregar Nuevos Servicios

1. Crear en `features/[feature]/services/`
2. Inyectar `HttpClientService`
3. Usar endpoints definidos en `api-endpoints.ts`

### Manejo de Errores

Todos los errores HTTP se interceptan automáticamente. Para personalizar:

Editar `core/interceptors/error.interceptor.ts`

### Carga de Datos

La carga global se muestra automáticamente para:
- POST, PUT, PATCH
- GET de dashboard, scoring, reports

Para personalizar, editar `core/interceptors/loading.interceptor.ts`

---

## 🧪 Testing

(Próximo paso para producción)

```bash
npm test
```

---

## 📦 Build y Deployment

### Build para Producción

```bash
npm run build:prod
```

Archivos en `dist/fraudia-fe/`

### Deployment a Servidor

1. Copiar contenido de `dist/fraudia-fe/` a servidor web
2. Configurar servidor para SPA (todas las rutas → index.html)
3. Configurar variables de ambiente en `environment.production.ts`

### Servidor Recomendado

- **Apache**: Habilitar mod_rewrite
- **Nginx**: Usar `try_files` para SPA
- **Firebase Hosting**: Automático
- **Vercel**: Automático

---

## 🤝 Integración con Backend FastAPI

### Paso 1: Asegurar CORS

En backend FastAPI:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Agregar URL de frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Paso 2: Configurar URL Backend

En `src/environments/environment.development.ts`:

```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000/api/v1',  // Ajustar según tu backend
  appEnv: 'development'
};
```

### Paso 3: Iniciar Aplicaciones

Terminal 1 - Backend:
```bash
python main.py
```

Terminal 2 - Frontend:
```bash
npm run start:dev
```

Acceder a `http://localhost:4200`

---

## 📱 Responsive Design

La aplicación es **mobile-first** y se adapta a:

- 📱 Móvil (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)

Características mobile:

- Sidebar colapsable
- Bottom navigation (móvil)
- Tabla responsive con scroll
- Formularios adaptados

---

## 🌈 Tema y Estilos

### Colores de Riesgo

- **Verde** (#10b981): Bajo riesgo (score < 30)
- **Amarillo** (#f59e0b): Riesgo medio (score 30-70)
- **Rojo** (#ef4444): Alto riesgo (score > 70)

### Paleta de Color

Basada en Tailwind CSS slate. Personalizable en `tailwind.config.js`

### Tipografía

Sistema por defecto de Tailwind (sans-serif)

---

## 📝 Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Inicia servidor dev (environment por defecto) |
| `npm run start:dev` | Inicia servidor dev (development) |
| `npm run start:test` | Inicia servidor dev (test) |
| `npm run build` | Build estándar |
| `npm run build:prod` | Build optimizado para producción |
| `npm run watch` | Watch mode para desarrollo |
| `npm test` | Ejecuta suite de tests (Karma/Jasmine) |
| `ng generate component` | Genera componente |
| `ng generate service` | Genera servicio |

---

## 🚨 Solución de Problemas

### Error: "Cannot find module '@angular/...'"

**Solución**: Ejecutar `npm install`

### Error: "Could not find Angular Material core theme"

**Solución**: Reiniciar servidor con `npm run start:dev`

### Estilos Tailwind no aplican

**Solución**: 
1. Verificar `styles.scss` tiene `@tailwind` directives
2. Reiniciar servidor
3. Limpiar cache: `npm run build`

### API no responde

**Solución**:
1. Verificar backend está corriendo
2. Verificar URL en `environment.development.ts`
3. Verificar CORS habilitado en backend
4. Revisar Network tab en DevTools

### Componentes no cargan

**Solución**:
1. Verificar import en componente
2. Verificar ruta en `app.routes.ts`
3. Revisar console para errores de compilación

---

## 📚 Recursos Útiles

- [Angular Documentation](https://angular.io)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [RxJS Documentation](https://rxjs.dev)
- [FastAPI Documentation](https://fastapi.tiangolo.com)

---

## 📄 Licencia

Proyecto desarrollado para Hackathon. MIT License.

---

## 👥 Autor

Generado automáticamente por GitHub Copilot para MVP de Hackathon - Detector de Posibles Fraudes en Siniestros usando IA.

---

**Última actualización**: 2024

¡Listo para usar! 🎉
