# ShinobiDex — Catálogo Ninja de Naruto

## 1. Descripción del proyecto

**ShinobiDex** Es una aplicación móvil desarrollada con React Native, Expo y TypeScript, que permite explorar personajes del universo Naruto y administrar una colección personal de ninjas favoritos.

La aplicación consume dos servicios:

- **Dattebayo API:** proporciona información pública de personajes de Naruto mediante solicitudes GET.
- **MockAPI:** permite almacenar y actualizar favoritos y notas personales mediante solicitudes GET, POST y PUT.

Se utiliza **TanStack Query** para administrar las consultas, la caché, las mutaciones y la sincronización de información, incluso cuando el dispositivo pierde temporalmente la conexión a internet.

El diseño está inspirado en la estética del anime Naruto, utilizando tonos naranja, negro y crema, además de ilustraciones y elementos visuales de estilo manga.

## 2. Objetivo

Desarrollar una aplicación móvil que integre una API pública de solo lectura y una API de datos propios, implementando almacenamiento en caché persistente, mutaciones y comportamiento offline-first mediante TanStack Query.

## 3. Tecnologías utilizadas

| Tecnología     | Función                             |
| -------------- | ----------------------------------- |
| React Native   | Desarrollo de la interfaz móvil     |
| Expo           | Entorno de desarrollo y compilación |
| TypeScript     | Tipado y organización del código    |
| Expo Router    | Navegación entre pantallas          |
| TanStack Query | Consultas, caché y mutaciones       |
| AsyncStorage   | Persistencia local de información   |
| Expo Network   | Detección del estado de conexión    |
| Dattebayo API  | Consulta de personajes de Naruto    |
| MockAPI        | Almacenamiento de favoritos y notas |
| EAS Build      | Generación del APK para Android     |
| Git y GitHub   | Control de versiones                |

## 4. Funcionalidades principales

### Catálogo de personajes

- Consultar hasta 100 personajes de Naruto desde Dattebayo.
- Mostrar imágenes, nombres e identificadores.
- Buscar personajes por nombre dentro de la página cargada.
- Visualizar información almacenada en caché.

### Mi colección

- Registrar ninjas favoritos.
- Añadir notas personales.
- Editar las notas de favoritos existentes.
- Visualizar expedientes almacenados en MockAPI.

### Funcionamiento sin conexión

- Conservar información consultada previamente.
- Consultar datos persistidos después de cerrar y abrir la aplicación.
- Registrar mutaciones pendientes cuando no existe conexión.
- Reanudar mutaciones pausadas al recuperar la conexión.
- Mostrar estados y registros de sincronización con hora.

## 5. Servicios REST utilizados

### API pública: Dattebayo

URL base:

`https://dattebayo-api.onrender.com`

Ejemplo de consulta:

`GET /characters?page=1&limit=100`

La información recibida incluye el identificador, el nombre y las imágenes de los personajes.

Esta API se utiliza únicamente para lectura.

### API de datos propios: MockAPI

Recurso utilizado:

`/favoritos`

Operaciones implementadas:

| Método | Operación                           |
| ------ | ----------------------------------- |
| GET    | Consultar favoritos                 |
| POST   | Crear un nuevo favorito             |
| PUT    | Actualizar las notas de un favorito |

Campos principales:

- `id`: identificador del registro.
- `personajeId`: identificador del personaje.
- `nombre`: nombre del ninja.
- `imagen`: dirección de imagen.
- `nota`: descripción o nota personal.

La dirección base de MockAPI se configura mediante la variable de entorno `EXPO_PUBLIC_MOCKAPI_URL`.

## 6. Administración de consultas con TanStack Query

### 6.1. Query Keys

Las `queryKeys` permiten identificar las consultas almacenadas en caché y administrar su actualización.

El proyecto organiza las claves para diferenciar el catálogo de personajes y los favoritos del usuario.

Por ejemplo:

- Catálogo de personajes: consulta de Dattebayo.
- Detalle de personaje: clave específica cuando se consulta un identificador.
- Favoritos: registros administrados en MockAPI.

La consulta del catálogo incorpora los parámetros de página y límite, evitando confundir los resultados de 20 personajes con los de 100 personajes.

### 6.2. staleTime

`staleTime` establece durante cuánto tiempo una consulta se considera actualizada.

Se diferencian las consultas de la API pública y las de MockAPI porque los personajes cambian poco, mientras que los favoritos pueden modificarse con mayor frecuencia.

Esto reduce las solicitudes innecesarias y mantiene actualizada la colección personal.

### 6.3. gcTime

`gcTime` establece cuánto tiempo pueden permanecer en memoria los datos de una consulta inactiva.

Para utilizar persistencia, se configura un tiempo de retención compatible con el tiempo máximo de conservación de la caché persistida.

En este proyecto se utiliza como referencia una duración de 24 horas.

## 7. Persistencia de caché

Para conservar la información entre sesiones se utilizan:

- `PersistQueryClientProvider`
- `createAsyncStoragePersister`
- `AsyncStorage`

Al consultar personajes con internet, TanStack Query almacena la respuesta en caché.

Posteriormente, al cerrar y volver a abrir la aplicación, el proveedor puede rehidratar los datos persistidos sin necesitar inmediatamente otra solicitud de red.

De esta manera, el usuario puede consultar información previamente almacenada cuando no tiene conexión.

## 8. Mutaciones y sincronización offline-first

Las operaciones de creación y edición de favoritos se implementan mediante `useMutation`.

Cada mutación utiliza una clave para identificar su operación.

Además, se utilizan:

- `mutationKey`: identifica las operaciones de creación y edición.
- `setMutationDefaults`: permite registrar funciones predeterminadas para recuperar mutaciones persistidas.
- `invalidateQueries`: solicita actualizar los datos de favoritos después de una mutación exitosa.
- `onlineManager`: administra el estado de conectividad.
- `resumePausedMutations`: reanuda las mutaciones que permanecieron pausadas.

### Ejemplo de funcionamiento

1. El usuario abre ShinobiDex con conexión a internet.
2. Accede a Mi colección.
3. Desactiva Wi-Fi y datos móviles.
4. Registra un nuevo favorito.
5. La aplicación muestra que la mutación está pendiente de sincronización.
6. El usuario cierra completamente la aplicación.
7. Al recuperar internet y abrir nuevamente ShinobiDex, se restauran las mutaciones persistidas.
8. La operación pendiente se reanuda y envía a MockAPI.
9. Se actualiza la consulta de favoritos.

Este procedimiento demuestra la persistencia de mutaciones y su recuperación después de cerrar la aplicación.

## 9. Estados de la interfaz

ShinobiDex muestra información relacionada con los diferentes estados de TanStack Query.

| Estado       | Descripción                                                      |
| ------------ | ---------------------------------------------------------------- |
| `isPending`  | Consulta o mutación que todavía no dispone de un resultado final |
| `isFetching` | Consulta que está obteniendo información                         |
| `isStale`    | Información considerada desactualizada                           |
| `isError`    | Error producido durante una operación                            |
| `isPaused`   | Mutación pausada, por ejemplo, debido a falta de conexión        |

Estos estados permiten informar al usuario sobre la carga, actualización y sincronización de los datos.

## 10. Registro de sincronización

La aplicación incluye un panel de registro para observar eventos relevantes del funcionamiento de las consultas y mutaciones.

Entre los eventos registrados se encuentran:

- Restauración de información persistida.
- Creación de mutaciones pendientes.
- Inicio de solicitudes.
- Confirmación de operaciones exitosas.

Los registros incorporan la hora del evento y se almacenan localmente para facilitar la demostración del comportamiento offline.

## 11. Instalación y ejecución

### Requisitos

- Node.js y npm.
- Visual Studio Code.
- Expo CLI mediante `npx`.
- Android con Expo Go compatible o APK generado mediante EAS.

### Procedimiento

Clonar el repositorio:

```bash
git clone https://github.com/USUARIO/NOMBRE-REPOSITORIO.git
```

Acceder a la carpeta:

```bash
cd NOMBRE-REPOSITORIO
```

Instalar dependencias:

```bash
npm install
```

Configurar el archivo `.env`:

```env
EXPO_PUBLIC_MOCKAPI_URL=URL_BASE_DE_MOCKAPI
```

Iniciar el proyecto:

```bash
npx expo start
```

Verificar TypeScript:

```bash
npx tsc --noEmit
```

Generar APK:

```bash
eas build --platform android --profile preview
```

## 12. Pruebas realizadas

| Prueba                       | Resultado esperado                    |
| ---------------------------- | ------------------------------------- |
| Consultar personajes online  | Mostrar personajes de Dattebayo       |
| Buscar personajes            | Filtrar el catálogo cargado           |
| Consultar personajes offline | Visualizar datos disponibles en caché |
| Crear favorito online        | Guardar registro en MockAPI           |
| Editar favorito online       | Actualizar nota en MockAPI            |
| Crear favorito offline       | Mostrar operación pendiente           |
| Cerrar y reabrir offline     | Restaurar información persistida      |
| Recuperar conexión           | Reanudar mutación pendiente           |
| Verificar MockAPI            | Confirmar favorito sincronizado       |
| Revisar registro             | Visualizar los eventos con su hora    |

## 13. Diseño visual

La aplicación utiliza una temática inspirada en Naruto y Project Rasengan.

Sus características visuales incluyen:

- Paleta naranja, negro, crema y blanco.
- Ilustración principal estilo anime.
- Fondo con textura manga.
- Tarjetas de personajes.
- Formularios tipo expediente ninja.
- Indicadores visuales de sincronización.

El diseño busca diferenciarse de una interfaz genérica y mantener coherencia con la temática del catálogo.

## 14. Conclusiones

El desarrollo de ShinobiDex permitió aplicar consultas REST, almacenamiento persistente, mutaciones y mecanismos de recuperación de operaciones pendientes en una aplicación móvil.

TanStack Query facilitó la administración del estado de los datos, mientras que AsyncStorage permitió conservar información entre sesiones.

La integración de Dattebayo y MockAPI permitió diferenciar las operaciones de consulta pública de las operaciones de creación y actualización de datos propios.

**ShinobiDex demuestra cómo una aplicación móvil puede continuar ofreciendo funcionalidades útiles durante una pérdida de conexión y sincronizar operaciones pendientes cuando se recupera internet.**

## 15. Recursos y referencias

- [TanStack Query — Documentación oficial](https://tanstack.com/query/latest)
- [Expo — Documentación oficial](https://docs.expo.dev/)
- [React Native — Documentación oficial](https://reactnative.dev/)
- [Dattebayo API](https://dattebayo-api.onrender.com/)
- [MockAPI](https://mockapi.io/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

---

**Proyecto académico:** Deber 4 — Aplicaciones Móviles.

**Aplicación:** ShinobiDex.

**Tecnologías principales:** React Native, Expo, TypeScript y TanStack Query.
