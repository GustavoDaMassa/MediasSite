# MediasSite — Mapa de Classes


<details id="dir-root">
<summary><strong>/ (raiz)</strong></summary>

<blockquote>

- [angular.json](angular.json) — configuração do workspace Angular (build, serve, test)
- [package.json](package.json) — dependências npm e scripts
- [tsconfig.json](tsconfig.json) / [tsconfig.app.json](tsconfig.app.json) / [tsconfig.spec.json](tsconfig.spec.json) — configurações TypeScript
- [proxy.conf.js](proxy.conf.js) — proxy de desenvolvimento (redireciona /api para o backend)
- [vercel.json](vercel.json) — configuração de deploy na Vercel
- [README.md](README.md) — documentação do projeto
- [.editorconfig](.editorconfig) / [.gitignore](.gitignore) — configurações de editor e Git

</blockquote>

</details>

---

<details id="dir-github">
<summary><strong>.github/</strong></summary>

<blockquote>

<details id="dir-github-workflows">
<summary><strong>workflows/</strong></summary>

<blockquote>

- [ci.yml](.github/workflows/ci.yml) — pipeline CI/CD

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-public">
<summary><strong>public/</strong></summary>

<blockquote>

- [favicon.ico](public/favicon.ico) — ícone do site

</blockquote>

</details>

---

## src


<details id="dir-src-root">
<summary><strong>(raiz)</strong></summary>

<blockquote>

- [index.html](src/index.html) — HTML principal da SPA
- [main.ts](src/main.ts) — bootstrap da aplicação Angular
- [styles.scss](src/styles.scss) — estilos globais e tema Angular Material

</blockquote>

</details>


<details id="dir-assets">
<summary><strong>assets/</strong></summary>

<blockquote>

- [logo.png](src/assets/logo.png) — logo do projeto

<details id="dir-assets-i18n">
<summary><strong>i18n/</strong></summary>

<blockquote>

- [pt-BR.json](src/assets/i18n/pt-BR.json) — traduções em português
- [en-US.json](src/assets/i18n/en-US.json) — traduções em inglês

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-environments">
<summary><strong>environments/</strong></summary>

<blockquote>

- [environment.ts](src/environments/environment.ts) — configuração de produção (apiUrl, etc.)
- [environment.development.ts](src/environments/environment.development.ts) — configuração de desenvolvimento

</blockquote>

</details>


<details id="dir-app">
<summary><strong>app/</strong></summary>

<blockquote>

<details id="app">
<summary><strong><a href="src/app/app.ts">app.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Componente raiz — define o layout principal com header fixo e router-outlet para as views de feature

</details>

</blockquote>

</details>


<details id="dir-core">
<summary><strong>core/</strong></summary>

<blockquote>

<details id="dir-core-guards">
<summary><strong>guards/</strong></summary>

<blockquote>

<details id="auth-guard">
<summary><strong><a href="src/app/core/guards/auth.guard.ts">auth.guard.ts</a> [guard]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Protege rotas autenticadas — redireciona para /login se não houver token válido

</details>

<details><summary>dependencias</summary>

- `AuthService`
- `Router`

</details>

<details><summary>metodos</summary>

- `authGuard(route, state) : boolean`

</details>

</blockquote>

</details>



<details id="no-auth-guard">
<summary><strong><a href="src/app/core/guards/no-auth.guard.ts">no-auth.guard.ts</a> [guard]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Protege rotas públicas (login/register) — redireciona para /courses se usuário já estiver autenticado

</details>

<details><summary>dependencias</summary>

- `AuthService`
- `Router`

</details>

<details><summary>metodos</summary>

- `noAuthGuard() : boolean`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-core-interceptors">
<summary><strong>interceptors/</strong></summary>

<blockquote>

<details id="auth-interceptor">
<summary><strong><a href="src/app/core/interceptors/auth.interceptor.ts">auth.interceptor.ts</a> [interceptor]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Adiciona o token JWT no header Authorization em todas as requisições não-públicas

</details>

<details><summary>dependencias</summary>

- `StorageService`

</details>

<details><summary>atributos</summary>

- `PUBLIC_URLS : string[]   [lista de URLs que não recebem o header]`

</details>

<details><summary>metodos</summary>

- `authInterceptor(req, next) : Observable<HttpEvent<any>>`

</details>

</blockquote>

</details>



<details id="error-interceptor">
<summary><strong><a href="src/app/core/interceptors/error.interceptor.ts">error.interceptor.ts</a> [interceptor]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Intercepta erros HTTP globalmente — traduz mensagens de erro, expira sessão em 401, notifica usuário via snackbar

</details>

<details><summary>dependencias</summary>

- `NotificationService`
- `TranslateService`
- `AuthService   [via Injector — evita dependência circular]`

</details>

<details><summary>metodos</summary>

- `errorInterceptor(req, next) : Observable<HttpEvent<any>>`

</details>

</blockquote>

</details>



<details id="http-context-tokens">
<summary><strong><a href="src/app/core/interceptors/http-context.tokens.ts">http-context.tokens.ts</a> [token]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define HttpContextToken SKIP_ERROR_NOTIFICATION — permite que requisições específicas puleem a notificação de erro do error.interceptor

</details>

<details><summary>atributos</summary>

- `SKIP_ERROR_NOTIFICATION : HttpContextToken<boolean>`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-core-services">
<summary><strong>services/</strong></summary>

<blockquote>

<details id="auth-service">
<summary><strong><a href="src/app/core/services/auth.service.ts">auth.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gerencia autenticação — login, register, logout, persistência de sessão em localStorage e signal de usuário autenticado atual

</details>

<details><summary>dependencias</summary>

- `HttpClient`
- `Router`
- `StorageService`

</details>

<details><summary>atributos</summary>

- `currentUser : Signal<CurrentUser | null>`
- `isAdmin     : Signal<boolean>   [computed de currentUser]`

</details>

<details><summary>metodos</summary>

- `login(request: LoginRequest)      : Observable<CurrentUser>`
- `register(request: RegisterRequest): Observable<UserDTO>`
- `logout()                          : void`
- `isAuthenticated()                 : boolean`

</details>

</blockquote>

</details>



<details id="storage-service">
<summary><strong><a href="src/app/core/services/storage.service.ts">storage.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Wrapper de localStorage — centraliza persistência de token, dados do usuário, tema e idioma

</details>

<details><summary>atributos</summary>

- `TOKEN_KEY  : string  [private]`
- `USER_ID_KEY: string  [private]`
- `EMAIL_KEY  : string  [private]`
- `NAME_KEY   : string  [private]`
- `ROLE_KEY   : string  [private]`
- `THEME_KEY  : string  [private]`
- `LANG_KEY   : string  [private]`

</details>

<details><summary>metodos</summary>

- `setToken / getToken / hasToken`
- `setUserId / getUserId`
- `setEmail / getEmail`
- `setName / getName`
- `setRole / getRole`
- `setTheme / getTheme`
- `setLang / getLang`
- `clearAuth() : void`

</details>

</blockquote>

</details>



<details id="theme-service">
<summary><strong><a href="src/app/core/services/theme.service.ts">theme.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gerencia tema dark/light — carrega do localStorage, detecta preferência do sistema via matchMedia, aplica via atributo data-theme no document

</details>

<details><summary>dependencias</summary>

- `StorageService`

</details>

<details><summary>atributos</summary>

- `currentTheme : Signal<'light' | 'dark'>`

</details>

<details><summary>metodos</summary>

- `toggle() : void`

</details>

</blockquote>

</details>



<details id="i18n-service">
<summary><strong><a href="src/app/core/services/i18n.service.ts">i18n.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Gerencia internacionalização (pt-BR, en-US) — inicializa TranslateService, persiste idioma preferido no localStorage

</details>

<details><summary>dependencias</summary>

- `TranslateService   [@ngx-translate/core]`
- `StorageService`

</details>

<details><summary>atributos</summary>

- `availableLanguages : Array<{ code: string; label: string }>`
- `currentLang        : Signal<string>`

</details>

<details><summary>metodos</summary>

- `init()                  : void`
- `switchLang(lang: string): void`

</details>

</blockquote>

</details>



<details id="notification-service">
<summary><strong><a href="src/app/core/services/notification.service.ts">notification.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Wrapper de MatSnackBar — expõe métodos success/error/info com classes CSS e posicionamento padronizado

</details>

<details><summary>dependencias</summary>

- `MatSnackBar   [Angular Material]`

</details>

<details><summary>metodos</summary>

- `success(message: string) : void`
- `error(message: string)   : void`
- `info(message: string)    : void`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-shared">
<summary><strong>shared/</strong></summary>

<blockquote>

<details id="dir-shared-models">
<summary><strong>models/</strong></summary>

<blockquote>

<details id="auth-model">
<summary><strong><a href="src/app/shared/models/auth.model.ts">auth.model.ts</a> [interface + enum]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define todos os modelos de autenticação — Role, DTOs de request/response e CurrentUser (usuário em sessão)

</details>

<details><summary>tipos</summary>

- `Role [enum]`
  - `ADMIN`
  - `USER`
- `UserDTO [interface]`
  - `id    : number`
  - `name  : string`
  - `email : string`
  - `role  : Role`
- `CurrentUser [interface — extends UserDTO]`
  - `token : string`
- `LoginRequest [interface]`
  - `email    : string`
  - `password : string`
- `RegisterRequest [interface]`
  - `name     : string`
  - `email    : string`
  - `password : string`
- `StringUpdateRequest [interface]`
  - `string : string`
- `EmailUpdateRequest [interface]`
  - `email : string`

</details>

</blockquote>

</details>



<details id="course-model">
<summary><strong><a href="src/app/shared/models/course.model.ts">course.model.ts</a> [interface]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define os modelos de Course — DTO de resposta e request de criação

</details>

<details><summary>tipos</summary>

- `CourseDTO [interface]`
  - `id            : number`
  - `name          : string`
  - `averageMethod : string`
  - `cutOffGrade   : number`
- `CreateCourseRequest [interface]`
  - `name          : string`
  - `averageMethod : string`
  - `cutOffGrade   : number`

</details>

</blockquote>

</details>



<details id="assessment-model">
<summary><strong><a href="src/app/shared/models/assessment.model.ts">assessment.model.ts</a> [interface]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define os modelos de Assessment — DTO de resposta e request de atualização de nota

</details>

<details><summary>tipos</summary>

- `AssessmentDTO [interface]`
  - `id            : number`
  - `identifier    : string`
  - `grade         : number`
  - `maxValue      : number`
  - `requiredGrade : number`
  - `fixed         : boolean`
- `GradeUpdateRequest [interface]`
  - `value : number`

</details>

</blockquote>

</details>



<details id="projection-model">
<summary><strong><a href="src/app/shared/models/projection.model.ts">projection.model.ts</a> [interface]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Define o modelo de Projection — DTO que combina projeção com lista de assessments

</details>

<details><summary>dependencias</summary>

- `AssessmentDTO`

</details>

<details><summary>tipos</summary>

- `ProjectionDTO [interface]`
  - `id          : number`
  - `name        : string`
  - `assessment  : AssessmentDTO[]`
  - `finalGrade  : number`
  - `courseName? : string`

</details>

</blockquote>

</details>



<details id="index">
<summary><strong><a href="src/app/shared/models/index.ts">index.ts</a></strong></summary>

<blockquote>



<details><summary>funcao</summary>

Barrel export — re-exporta todos os modelos para imports limpos (from '../models')

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-shared-components">
<summary><strong>components/</strong></summary>

<blockquote>

<details id="dir-shared-confirm-dialog">
<summary><strong>confirm-dialog/</strong></summary>

<blockquote>

<details id="confirm-dialog-component">
<summary><strong><a href="src/app/shared/components/confirm-dialog/confirm-dialog.component.ts">confirm-dialog.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Modal reutilizável de confirmação — recebe título e mensagem via MAT_DIALOG_DATA, retorna boolean ao fechar

</details>

<details><summary>dependencias</summary>

- `MatDialogRef<ConfirmDialogComponent>`
- `MAT_DIALOG_DATA   [ConfirmDialogData: { title, message }]`

</details>

<details><summary>atributos</summary>

- `dialogRef : MatDialogRef<ConfirmDialogComponent>`
- `data      : ConfirmDialogData`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-shared-header">
<summary><strong>header/</strong></summary>

<blockquote>

<details id="header-component">
<summary><strong><a href="src/app/shared/components/header/header.component.ts">header.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Barra de navegação principal — exibe usuário autenticado, toggle de tema, toggle de idioma e menu dropdown com logout

</details>

<details><summary>dependencias</summary>

- `AuthService`
- `ThemeService`
- `I18nService`

</details>

<details><summary>atributos</summary>

- `isAuthenticated   : () => boolean   [computed de AuthService]`
- `currentUser       : Signal<CurrentUser | null>`
- `userInitials      : Signal<string>   [computed de currentUser]`
- `currentTheme      : Signal<'light' | 'dark'>`
- `themeIcon         : Signal<string>   [computed]`
- `themeTooltipKey   : Signal<string>   [computed]`
- `currentLang       : Signal<string>`
- `currentLangLabel  : Signal<string>   [computed]`

</details>

<details><summary>metodos</summary>

- `toggleTheme() : void`
- `toggleLang()  : void`
- `logout()      : void`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-shared-loading-spinner">
<summary><strong>loading-spinner/</strong></summary>

<blockquote>

<details id="loading-spinner-component">
<summary><strong><a href="src/app/shared/components/loading-spinner/loading-spinner.component.ts">loading-spinner.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Spinner de carregamento reutilizável com diâmetro 48 — usado por qualquer componente que precise indicar loading

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-features">
<summary><strong>features/</strong></summary>

<blockquote>

<details id="dir-features-auth">
<summary><strong>auth/</strong></summary>

<blockquote>

<details id="dir-features-auth-login">
<summary><strong>login/</strong></summary>

<blockquote>

<details id="login-component">
<summary><strong><a href="src/app/features/auth/login/login.component.ts">login.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Formulário de login — valida email/senha, chama AuthService.login(), navega para /courses ao autenticar

</details>

<details><summary>dependencias</summary>

- `FormBuilder`
- `AuthService`

</details>

<details><summary>atributos</summary>

- `loading      : Signal<boolean>`
- `hidePassword : Signal<boolean>`
- `form         : FormGroup   [email: required/email, password: required/minLength(6)]`

</details>

<details><summary>metodos</summary>

- `onSubmit() : void`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-features-auth-register">
<summary><strong>register/</strong></summary>

<blockquote>

<details id="register-component">
<summary><strong><a href="src/app/features/auth/register/register.component.ts">register.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Formulário de registro — valida name/email/senha, chama AuthService.register(), redireciona para /login

</details>

<details><summary>dependencias</summary>

- `FormBuilder`
- `AuthService`
- `NotificationService`
- `TranslateService`
- `Router`

</details>

<details><summary>atributos</summary>

- `loading      : Signal<boolean>`
- `hidePassword : Signal<boolean>`
- `form         : FormGroup   [name: required, email: required/email, password: required/minLength(6)]`

</details>

<details><summary>metodos</summary>

- `onSubmit() : void`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-features-courses">
<summary><strong>courses/</strong></summary>

<blockquote>

<details id="courses-service">
<summary><strong><a href="src/app/features/courses/courses.service.ts">courses.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Serviço HTTP para CRUD de Courses — suporta forkJoin para atualizar múltiplos campos simultaneamente e HttpContext para controlar interceptors

</details>

<details><summary>dependencias</summary>

- `HttpClient`

</details>

<details><summary>atributos</summary>

- `base : string   [URL base da API]`

</details>

<details><summary>metodos</summary>

- `list(userId: number)                                                        : Observable<CourseDTO[]>`
- `create(userId: number, req: CreateCourseRequest, ctx?: HttpContext)          : Observable<CourseDTO>`
- `updateName(userId, courseId, name, ctx?)                                    : Observable<CourseDTO>`
- `updateMethod(userId, courseId, method, ctx?)                                : Observable<CourseDTO>`
- `updateCutOff(userId, courseId, cutOff, ctx?)                                : Observable<CourseDTO>`
- `update(userId, courseId, changes: {name?, method?, cutOff?}, ctx?)          : Observable<CourseDTO[]>   [forkJoin]`
- `delete(userId: number, courseId: number)                                    : Observable<void>`
- `listAllProjections(userId: number)                                          : Observable<ProjectionDTO[]>`

</details>

</blockquote>

</details>


<details id="dir-course-form">
<summary><strong>course-form/</strong></summary>

<blockquote>

<details id="course-form-component">
<summary><strong><a href="src/app/features/courses/course-form/course-form.component.ts">course-form.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Formulário de criação e edição de Course — detecta modo edit pelo routeParam, valida fórmula via HttpContext, abre modal de ajuda de fórmula

</details>

<details><summary>dependencias</summary>

- `FormBuilder`
- `ActivatedRoute`
- `Router`
- `AuthService`
- `CoursesService`
- `NotificationService`
- `TranslateService`
- `MatDialog`

</details>

<details><summary>atributos</summary>

- `loading        : Signal<boolean>`
- `loadingData    : Signal<boolean>`
- `isEditMode     : Signal<boolean>`
- `formError      : Signal<string | null>`
- `courseId       : number`
- `originalValues : { name, method, cutOff }`
- `form           : FormGroup   [name, averageMethod, cutOffGrade]`
- `skipErrorCtx   : HttpContext   [SKIP_ERROR_NOTIFICATION]`

</details>

<details><summary>metodos</summary>

- `ngOnInit()         : void`
- `onSubmit()         : void`
- `openFormulaHelp()  : void`

</details>

</blockquote>

</details>


<details id="formula-help-dialog-component">
<summary><strong><a href="src/app/features/courses/course-form/formula-help-dialog.component.ts">formula-help-dialog.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Modal de ajuda sobre sintaxe de fórmulas — exibe exemplos de identificadores, operadores, maxGrade e topN

</details>

<details><summary>dependencias</summary>

- `TranslatePipe`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-course-list">
<summary><strong>course-list/</strong></summary>

<blockquote>

<details id="course-list-component">
<summary><strong><a href="src/app/features/courses/course-list/course-list.component.ts">course-list.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Lista cursos do usuário autenticado — permite navegar para edição e deletar com modal de confirmação

</details>

<details><summary>dependencias</summary>

- `AuthService`
- `CoursesService`
- `NotificationService`
- `TranslateService`
- `MatDialog`

</details>

<details><summary>atributos</summary>

- `courses : Signal<CourseDTO[]>`
- `loading : Signal<boolean>`

</details>

<details><summary>metodos</summary>

- `ngOnInit()                                    : void`
- `confirmDelete(course: CourseDTO)               : void`
- `truncate(text: string, maxLen: number)         : string`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-features-projections">
<summary><strong>projections/</strong></summary>

<blockquote>

<details id="projections-service">
<summary><strong><a href="src/app/features/projections/projections.service.ts">projections.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Serviço HTTP para CRUD de Projections dentro de um Course

</details>

<details><summary>dependencias</summary>

- `HttpClient`

</details>

<details><summary>atributos</summary>

- `base : string`

</details>

<details><summary>metodos</summary>

- `list(courseId: number)                                                  : Observable<ProjectionDTO[]>`
- `create(courseId: number, name: string)                                  : Observable<ProjectionDTO>`
- `updateName(courseId: number, projectionId: number, name: string)        : Observable<ProjectionDTO>`
- `delete(courseId: number, projectionId: number)                          : Observable<void>`

</details>

</blockquote>

</details>


<details id="dir-projection-form">
<summary><strong>projection-form/</strong></summary>

<blockquote>

<details id="projection-form-component">
<summary><strong><a href="src/app/features/projections/projection-form/projection-form.component.ts">projection-form.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Formulário de criação e edição de Projection — detecta modo edit pelo routeParam, submete POST ou PATCH

</details>

<details><summary>dependencias</summary>

- `FormBuilder`
- `ActivatedRoute`
- `Router`
- `ProjectionsService`
- `NotificationService`
- `TranslateService`

</details>

<details><summary>atributos</summary>

- `loading      : Signal<boolean>`
- `isEditMode   : Signal<boolean>`
- `courseId     : number`
- `projectionId : number`
- `form         : FormGroup   [name: required]`

</details>

<details><summary>metodos</summary>

- `ngOnInit()  : void`
- `onSubmit()  : void`

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-projection-list">
<summary><strong>projection-list/</strong></summary>

<blockquote>

<details id="projection-list-component">
<summary><strong><a href="src/app/features/projections/projection-list/projection-list.component.ts">projection-list.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Lista projeções de um curso com tabela de assessments embutida — exibe nota final com classe de cor (aprovado/reprovado), suporta delete com confirmação

</details>

<details><summary>dependencias</summary>

- `ActivatedRoute`
- `Router`
- `ProjectionsService`
- `CoursesService`
- `AuthService`
- `NotificationService`
- `TranslateService`
- `MatDialog`

</details>

<details><summary>atributos</summary>

- `projections        : Signal<ProjectionDTO[]>`
- `courseName         : Signal<string>`
- `cutOffGrade        : Signal<number>`
- `loading            : Signal<boolean>`
- `courseId           : number`
- `assessmentColumns  : string[]   [colunas da tabela Material]`

</details>

<details><summary>metodos</summary>

- `ngOnInit()                                              : void`
- `isGraded(assessment: AssessmentDTO)                     : boolean`
- `getFinalGradeClass(projection: ProjectionDTO)           : string`
- `navigateToEdit(projection: ProjectionDTO)               : void`
- `confirmDelete(projection: ProjectionDTO)                : void`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-features-assessments">
<summary><strong>assessments/</strong></summary>

<blockquote>

<details id="assessments-service">
<summary><strong><a href="src/app/features/assessments/assessments.service.ts">assessments.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Serviço HTTP para listar assessments de uma projeção e atualizar notas via PATCH

</details>

<details><summary>dependencias</summary>

- `HttpClient`

</details>

<details><summary>atributos</summary>

- `base : string`

</details>

<details><summary>metodos</summary>

- `list(projectionId: number)                                              : Observable<AssessmentDTO[]>`
- `updateGrade(projectionId: number, assessmentId: number, value: number)  : Observable<AssessmentDTO>`

</details>

</blockquote>

</details>


<details id="dir-assessment-grade">
<summary><strong>assessment-grade/</strong></summary>

<blockquote>

<details id="assessment-grade-component">
<summary><strong><a href="src/app/features/assessments/assessment-grade/assessment-grade.component.ts">assessment-grade.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Formulário de inserção de nota — carrega o assessment, valida nota contra maxValue, submete PATCH com nova nota e navega de volta

</details>

<details><summary>dependencias</summary>

- `FormBuilder`
- `ActivatedRoute`
- `Router`
- `AssessmentsService`
- `NotificationService`
- `TranslateService`

</details>

<details><summary>atributos</summary>

- `loading      : Signal<boolean>`
- `loadingData  : Signal<boolean>`
- `assessment   : Signal<AssessmentDTO | null>`
- `effectiveMax : Signal<number>   [computed de assessment]`
- `courseId     : number`
- `projectionId : number`
- `assessmentId : number`
- `form         : FormGroup   [grade: required/min(0)/max(effectiveMax)]`

</details>

<details><summary>metodos</summary>

- `ngOnInit() : void`
- `onSubmit() : void`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-features-overview">
<summary><strong>overview/</strong></summary>

<blockquote>

<details id="dir-features-overview-user">
<summary><strong>user-overview/</strong></summary>

<blockquote>

<details id="user-overview-component">
<summary><strong><a href="src/app/features/overview/user-overview/user-overview.component.ts">user-overview.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Dashboard do usuário — lista todas as projeções de todos os cursos com status de aprovação; mapeia courseId e cutOff por nome de curso para calcular status visual

</details>

<details><summary>dependencias</summary>

- `AuthService`
- `CoursesService`

</details>

<details><summary>atributos</summary>

- `projections  : Signal<ProjectionDTO[]>`
- `courseIdMap  : Signal<Map<string, number>>   [nome → id]`
- `cutOffMap    : Signal<Map<string, number>>   [nome → cutOff]`
- `loading      : Signal<boolean>`

</details>

<details><summary>metodos</summary>

- `ngOnInit()                                                       : void`
- `getCourseId(courseName: string | undefined)                       : number`
- `isGraded(assessment: AssessmentDTO)                               : boolean`
- `getFinalGradeClass(grade: number, courseName: string | undefined) : string`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>


<details id="dir-features-profile">
<summary><strong>profile/</strong></summary>

<blockquote>

<details id="user-service">
<summary><strong><a href="src/app/features/profile/user.service.ts">user.service.ts</a> [service]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Serviço HTTP para operações de perfil do usuário — atualizar nome, email e deletar conta

</details>

<details><summary>dependencias</summary>

- `HttpClient`

</details>

<details><summary>atributos</summary>

- `base : string`

</details>

<details><summary>metodos</summary>

- `updateName(userId: number, name: string)   : Observable<UserDTO>`
- `updateEmail(userId: number, email: string) : Observable<UserDTO>`
- `delete(userId: number)                     : Observable<void>`

</details>

</blockquote>

</details>


<details id="profile-component">
<summary><strong><a href="src/app/features/profile/profile.component.ts">profile.component.ts</a> [component]</strong></summary>

<blockquote>



<details><summary>funcao</summary>

Tela de perfil — permite atualizar nome e email independentemente, e deletar conta com confirmação; usa dois formulários separados para edição parcial

</details>

<details><summary>dependencias</summary>

- `FormBuilder`
- `AuthService`
- `StorageService`
- `UserService`
- `NotificationService`
- `TranslateService`
- `MatDialog`

</details>

<details><summary>atributos</summary>

- `loadingName   : Signal<boolean>`
- `loadingEmail  : Signal<boolean>`
- `loadingDelete : Signal<boolean>`
- `nameForm      : FormGroup   [name: required/minLength(2)]`
- `emailForm     : FormGroup   [email: required/email]`

</details>

<details><summary>metodos</summary>

- `ngOnInit()       : void`
- `updateName()     : void`
- `updateEmail()    : void`
- `confirmDelete()  : void`

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>

</blockquote>

</details>
