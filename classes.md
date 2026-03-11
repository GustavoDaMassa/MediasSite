# MediasSite — Mapa de Classes

---

## MODELS

---

### auth.model.ts [interface + enum]

```
auth.model.ts
├── funcao/ Define todos os modelos de autenticação — Role, DTOs de request/response e CurrentUser (usuário em sessão)
├── tipos/
│   ├── Role [enum]
│   │   ├── ADMIN
│   │   └── USER
│   ├── UserDTO [interface]
│   │   ├── id    : number
│   │   ├── name  : string
│   │   ├── email : string
│   │   └── role  : Role
│   ├── CurrentUser [interface — extends UserDTO]
│   │   └── token : string
│   ├── LoginRequest [interface]
│   │   ├── email    : string
│   │   └── password : string
│   ├── RegisterRequest [interface]
│   │   ├── name     : string
│   │   ├── email    : string
│   │   └── password : string
│   ├── StringUpdateRequest [interface]
│   │   └── string : string
│   └── EmailUpdateRequest [interface]
│       └── email : string
```

---

### course.model.ts [interface]

```
course.model.ts
├── funcao/ Define os modelos de Course — DTO de resposta e request de criação
├── tipos/
│   ├── CourseDTO [interface]
│   │   ├── id            : number
│   │   ├── name          : string
│   │   ├── averageMethod : string
│   │   └── cutOffGrade   : number
│   └── CreateCourseRequest [interface]
│       ├── name          : string
│       ├── averageMethod : string
│       └── cutOffGrade   : number
```

---

### assessment.model.ts [interface]

```
assessment.model.ts
├── funcao/ Define os modelos de Assessment — DTO de resposta e request de atualização de nota
├── tipos/
│   ├── AssessmentDTO [interface]
│   │   ├── id            : number
│   │   ├── identifier    : string
│   │   ├── grade         : number
│   │   ├── maxValue      : number
│   │   ├── requiredGrade : number
│   │   └── fixed         : boolean
│   └── GradeUpdateRequest [interface]
│       └── value : number
```

---

### projection.model.ts [interface]

```
projection.model.ts
├── funcao/ Define o modelo de Projection — DTO que combina projeção com lista de assessments
├── dependencias/
│   └── AssessmentDTO
└── tipos/
    └── ProjectionDTO [interface]
        ├── id          : number
        ├── name        : string
        ├── assessment  : AssessmentDTO[]
        ├── finalGrade  : number
        └── courseName? : string
```

---

### index.ts

```
index.ts
├── funcao/ Barrel export — re-exporta todos os modelos para imports limpos (from '../models')
```

---

## CORE — GUARDS

---

### auth.guard.ts [guard]

```
auth.guard.ts
├── funcao/ Protege rotas autenticadas — redireciona para /login se não houver token válido
├── dependencias/
│   ├── AuthService
│   └── Router
└── metodos/
    └── authGuard(route, state) : boolean
```

---

### no-auth.guard.ts [guard]

```
no-auth.guard.ts
├── funcao/ Protege rotas públicas (login/register) — redireciona para /courses se usuário já estiver autenticado
├── dependencias/
│   ├── AuthService
│   └── Router
└── metodos/
    └── noAuthGuard() : boolean
```

---

## CORE — INTERCEPTORS

---

### auth.interceptor.ts [interceptor]

```
auth.interceptor.ts
├── funcao/ Adiciona o token JWT no header Authorization em todas as requisições não-públicas
├── dependencias/
│   └── StorageService
├── atributos/
│   └── PUBLIC_URLS : string[]   [lista de URLs que não recebem o header]
└── metodos/
    └── authInterceptor(req, next) : Observable<HttpEvent<any>>
```

---

### error.interceptor.ts [interceptor]

```
error.interceptor.ts
├── funcao/ Intercepta erros HTTP globalmente — traduz mensagens de erro, expira sessão em 401, notifica usuário via snackbar
├── dependencias/
│   ├── NotificationService
│   ├── TranslateService
│   └── AuthService   [via Injector — evita dependência circular]
└── metodos/
    └── errorInterceptor(req, next) : Observable<HttpEvent<any>>
```

---

### http-context.tokens.ts [token]

```
http-context.tokens.ts
├── funcao/ Define HttpContextToken SKIP_ERROR_NOTIFICATION — permite que requisições específicas puleem a notificação de erro do error.interceptor
└── atributos/
    └── SKIP_ERROR_NOTIFICATION : HttpContextToken<boolean>
```

---

## CORE — SERVICES

---

### auth.service.ts [service]

```
auth.service.ts
├── funcao/ Gerencia autenticação — login, register, logout, persistência de sessão em localStorage e signal de usuário autenticado atual
├── dependencias/
│   ├── HttpClient
│   ├── Router
│   └── StorageService
├── atributos/
│   ├── currentUser : Signal<CurrentUser | null>
│   └── isAdmin     : Signal<boolean>   [computed de currentUser]
└── metodos/
    ├── login(request: LoginRequest)      : Observable<CurrentUser>
    ├── register(request: RegisterRequest): Observable<UserDTO>
    ├── logout()                          : void
    └── isAuthenticated()                 : boolean
```

---

### storage.service.ts [service]

```
storage.service.ts
├── funcao/ Wrapper de localStorage — centraliza persistência de token, dados do usuário, tema e idioma
├── atributos/
│   ├── TOKEN_KEY  : string  [private]
│   ├── USER_ID_KEY: string  [private]
│   ├── EMAIL_KEY  : string  [private]
│   ├── NAME_KEY   : string  [private]
│   ├── ROLE_KEY   : string  [private]
│   ├── THEME_KEY  : string  [private]
│   └── LANG_KEY   : string  [private]
└── metodos/
    ├── setToken / getToken / hasToken
    ├── setUserId / getUserId
    ├── setEmail / getEmail
    ├── setName / getName
    ├── setRole / getRole
    ├── setTheme / getTheme
    ├── setLang / getLang
    └── clearAuth() : void
```

---

### theme.service.ts [service]

```
theme.service.ts
├── funcao/ Gerencia tema dark/light — carrega do localStorage, detecta preferência do sistema via matchMedia, aplica via atributo data-theme no document
├── dependencias/
│   └── StorageService
├── atributos/
│   └── currentTheme : Signal<'light' | 'dark'>
└── metodos/
    └── toggle() : void
```

---

### i18n.service.ts [service]

```
i18n.service.ts
├── funcao/ Gerencia internacionalização (pt-BR, en-US) — inicializa TranslateService, persiste idioma preferido no localStorage
├── dependencias/
│   ├── TranslateService   [@ngx-translate/core]
│   └── StorageService
├── atributos/
│   ├── availableLanguages : Array<{ code: string; label: string }>
│   └── currentLang        : Signal<string>
└── metodos/
    ├── init()                  : void
    └── switchLang(lang: string): void
```

---

### notification.service.ts [service]

```
notification.service.ts
├── funcao/ Wrapper de MatSnackBar — expõe métodos success/error/info com classes CSS e posicionamento padronizado
├── dependencias/
│   └── MatSnackBar   [Angular Material]
└── metodos/
    ├── success(message: string) : void
    ├── error(message: string)   : void
    └── info(message: string)    : void
```

---

## SHARED — COMPONENTS

---

### header.component.ts [component]

```
header.component.ts
├── funcao/ Barra de navegação principal — exibe usuário autenticado, toggle de tema, toggle de idioma e menu dropdown com logout
├── dependencias/
│   ├── AuthService
│   ├── ThemeService
│   └── I18nService
├── atributos/
│   ├── isAuthenticated   : () => boolean   [computed de AuthService]
│   ├── currentUser       : Signal<CurrentUser | null>
│   ├── userInitials      : Signal<string>   [computed de currentUser]
│   ├── currentTheme      : Signal<'light' | 'dark'>
│   ├── themeIcon         : Signal<string>   [computed]
│   ├── themeTooltipKey   : Signal<string>   [computed]
│   ├── currentLang       : Signal<string>
│   └── currentLangLabel  : Signal<string>   [computed]
└── metodos/
    ├── toggleTheme() : void
    ├── toggleLang()  : void
    └── logout()      : void
```

---

### confirm-dialog.component.ts [component]

```
confirm-dialog.component.ts
├── funcao/ Modal reutilizável de confirmação — recebe título e mensagem via MAT_DIALOG_DATA, retorna boolean ao fechar
├── dependencias/
│   ├── MatDialogRef<ConfirmDialogComponent>
│   └── MAT_DIALOG_DATA   [ConfirmDialogData: { title, message }]
├── atributos/
│   ├── dialogRef : MatDialogRef<ConfirmDialogComponent>
│   └── data      : ConfirmDialogData
```

---

### loading-spinner.component.ts [component]

```
loading-spinner.component.ts
├── funcao/ Spinner de carregamento reutilizável com diâmetro 48 — usado por qualquer componente que precise indicar loading
```

---

## FEATURES — AUTH

---

### login.component.ts [component]

```
login.component.ts
├── funcao/ Formulário de login — valida email/senha, chama AuthService.login(), navega para /courses ao autenticar
├── dependencias/
│   ├── FormBuilder
│   └── AuthService
├── atributos/
│   ├── loading      : Signal<boolean>
│   ├── hidePassword : Signal<boolean>
│   └── form         : FormGroup   [email: required/email, password: required/minLength(6)]
└── metodos/
    └── onSubmit() : void
```

---

### register.component.ts [component]

```
register.component.ts
├── funcao/ Formulário de registro — valida name/email/senha, chama AuthService.register(), redireciona para /login
├── dependencias/
│   ├── FormBuilder
│   ├── AuthService
│   ├── NotificationService
│   ├── TranslateService
│   └── Router
├── atributos/
│   ├── loading      : Signal<boolean>
│   ├── hidePassword : Signal<boolean>
│   └── form         : FormGroup   [name: required, email: required/email, password: required/minLength(6)]
└── metodos/
    └── onSubmit() : void
```

---

## FEATURES — COURSES

---

### courses.service.ts [service]

```
courses.service.ts
├── funcao/ Serviço HTTP para CRUD de Courses — suporta forkJoin para atualizar múltiplos campos simultaneamente e HttpContext para controlar interceptors
├── dependencias/
│   └── HttpClient
├── atributos/
│   └── base : string   [URL base da API]
└── metodos/
    ├── list(userId: number)                                                        : Observable<CourseDTO[]>
    ├── create(userId: number, req: CreateCourseRequest, ctx?: HttpContext)          : Observable<CourseDTO>
    ├── updateName(userId, courseId, name, ctx?)                                    : Observable<CourseDTO>
    ├── updateMethod(userId, courseId, method, ctx?)                                : Observable<CourseDTO>
    ├── updateCutOff(userId, courseId, cutOff, ctx?)                                : Observable<CourseDTO>
    ├── update(userId, courseId, changes: {name?, method?, cutOff?}, ctx?)          : Observable<CourseDTO[]>   [forkJoin]
    ├── delete(userId: number, courseId: number)                                    : Observable<void>
    └── listAllProjections(userId: number)                                          : Observable<ProjectionDTO[]>
```

---

### course-list.component.ts [component]

```
course-list.component.ts
├── funcao/ Lista cursos do usuário autenticado — permite navegar para edição e deletar com modal de confirmação
├── dependencias/
│   ├── AuthService
│   ├── CoursesService
│   ├── NotificationService
│   ├── TranslateService
│   └── MatDialog
├── atributos/
│   ├── courses : Signal<CourseDTO[]>
│   └── loading : Signal<boolean>
└── metodos/
    ├── ngOnInit()                                    : void
    ├── confirmDelete(course: CourseDTO)               : void
    └── truncate(text: string, maxLen: number)         : string
```

---

### course-form.component.ts [component]

```
course-form.component.ts
├── funcao/ Formulário de criação e edição de Course — detecta modo edit pelo routeParam, valida fórmula via HttpContext, abre modal de ajuda de fórmula
├── dependencias/
│   ├── FormBuilder
│   ├── ActivatedRoute
│   ├── Router
│   ├── AuthService
│   ├── CoursesService
│   ├── NotificationService
│   ├── TranslateService
│   └── MatDialog
├── atributos/
│   ├── loading        : Signal<boolean>
│   ├── loadingData    : Signal<boolean>
│   ├── isEditMode     : Signal<boolean>
│   ├── formError      : Signal<string | null>
│   ├── courseId       : number
│   ├── originalValues : { name, method, cutOff }
│   ├── form           : FormGroup   [name, averageMethod, cutOffGrade]
│   └── skipErrorCtx   : HttpContext   [SKIP_ERROR_NOTIFICATION]
└── metodos/
    ├── ngOnInit()         : void
    ├── onSubmit()         : void
    └── openFormulaHelp()  : void
```

---

### formula-help-dialog.component.ts [component]

```
formula-help-dialog.component.ts
├── funcao/ Modal de ajuda sobre sintaxe de fórmulas — exibe exemplos de identificadores, operadores, maxGrade e topN
├── dependencias/
│   └── TranslatePipe
```

---

## FEATURES — PROJECTIONS

---

### projections.service.ts [service]

```
projections.service.ts
├── funcao/ Serviço HTTP para CRUD de Projections dentro de um Course
├── dependencias/
│   └── HttpClient
├── atributos/
│   └── base : string
└── metodos/
    ├── list(courseId: number)                                                  : Observable<ProjectionDTO[]>
    ├── create(courseId: number, name: string)                                  : Observable<ProjectionDTO>
    ├── updateName(courseId: number, projectionId: number, name: string)        : Observable<ProjectionDTO>
    └── delete(courseId: number, projectionId: number)                          : Observable<void>
```

---

### projection-list.component.ts [component]

```
projection-list.component.ts
├── funcao/ Lista projeções de um curso com tabela de assessments embutida — exibe nota final com classe de cor (aprovado/reprovado), suporta delete com confirmação
├── dependencias/
│   ├── ActivatedRoute
│   ├── Router
│   ├── ProjectionsService
│   ├── CoursesService
│   ├── AuthService
│   ├── NotificationService
│   ├── TranslateService
│   └── MatDialog
├── atributos/
│   ├── projections        : Signal<ProjectionDTO[]>
│   ├── courseName         : Signal<string>
│   ├── cutOffGrade        : Signal<number>
│   ├── loading            : Signal<boolean>
│   ├── courseId           : number
│   └── assessmentColumns  : string[]   [colunas da tabela Material]
└── metodos/
    ├── ngOnInit()                                              : void
    ├── isGraded(assessment: AssessmentDTO)                     : boolean
    ├── getFinalGradeClass(projection: ProjectionDTO)           : string
    ├── navigateToEdit(projection: ProjectionDTO)               : void
    └── confirmDelete(projection: ProjectionDTO)                : void
```

---

### projection-form.component.ts [component]

```
projection-form.component.ts
├── funcao/ Formulário de criação e edição de Projection — detecta modo edit pelo routeParam, submete POST ou PATCH
├── dependencias/
│   ├── FormBuilder
│   ├── ActivatedRoute
│   ├── Router
│   ├── ProjectionsService
│   ├── NotificationService
│   └── TranslateService
├── atributos/
│   ├── loading      : Signal<boolean>
│   ├── isEditMode   : Signal<boolean>
│   ├── courseId     : number
│   ├── projectionId : number
│   └── form         : FormGroup   [name: required]
└── metodos/
    ├── ngOnInit()  : void
    └── onSubmit()  : void
```

---

## FEATURES — ASSESSMENTS

---

### assessments.service.ts [service]

```
assessments.service.ts
├── funcao/ Serviço HTTP para listar assessments de uma projeção e atualizar notas via PATCH
├── dependencias/
│   └── HttpClient
├── atributos/
│   └── base : string
└── metodos/
    ├── list(projectionId: number)                                              : Observable<AssessmentDTO[]>
    └── updateGrade(projectionId: number, assessmentId: number, value: number)  : Observable<AssessmentDTO>
```

---

### assessment-grade.component.ts [component]

```
assessment-grade.component.ts
├── funcao/ Formulário de inserção de nota — carrega o assessment, valida nota contra maxValue, submete PATCH com nova nota e navega de volta
├── dependencias/
│   ├── FormBuilder
│   ├── ActivatedRoute
│   ├── Router
│   ├── AssessmentsService
│   ├── NotificationService
│   └── TranslateService
├── atributos/
│   ├── loading      : Signal<boolean>
│   ├── loadingData  : Signal<boolean>
│   ├── assessment   : Signal<AssessmentDTO | null>
│   ├── effectiveMax : Signal<number>   [computed de assessment]
│   ├── courseId     : number
│   ├── projectionId : number
│   ├── assessmentId : number
│   └── form         : FormGroup   [grade: required/min(0)/max(effectiveMax)]
└── metodos/
    ├── ngOnInit() : void
    └── onSubmit() : void
```

---

## FEATURES — OVERVIEW

---

### user-overview.component.ts [component]

```
user-overview.component.ts
├── funcao/ Dashboard do usuário — lista todas as projeções de todos os cursos com status de aprovação; mapeia courseId e cutOff por nome de curso para calcular status visual
├── dependencias/
│   ├── AuthService
│   └── CoursesService
├── atributos/
│   ├── projections  : Signal<ProjectionDTO[]>
│   ├── courseIdMap  : Signal<Map<string, number>>   [nome → id]
│   ├── cutOffMap    : Signal<Map<string, number>>   [nome → cutOff]
│   └── loading      : Signal<boolean>
└── metodos/
    ├── ngOnInit()                                                       : void
    ├── getCourseId(courseName: string | undefined)                       : number
    ├── isGraded(assessment: AssessmentDTO)                               : boolean
    └── getFinalGradeClass(grade: number, courseName: string | undefined) : string
```

---

## FEATURES — PROFILE

---

### user.service.ts [service]

```
user.service.ts
├── funcao/ Serviço HTTP para operações de perfil do usuário — atualizar nome, email e deletar conta
├── dependencias/
│   └── HttpClient
├── atributos/
│   └── base : string
└── metodos/
    ├── updateName(userId: number, name: string)   : Observable<UserDTO>
    ├── updateEmail(userId: number, email: string) : Observable<UserDTO>
    └── delete(userId: number)                     : Observable<void>
```

---

### profile.component.ts [component]

```
profile.component.ts
├── funcao/ Tela de perfil — permite atualizar nome e email independentemente, e deletar conta com confirmação; usa dois formulários separados para edição parcial
├── dependencias/
│   ├── FormBuilder
│   ├── AuthService
│   ├── StorageService
│   ├── UserService
│   ├── NotificationService
│   ├── TranslateService
│   └── MatDialog
├── atributos/
│   ├── loadingName   : Signal<boolean>
│   ├── loadingEmail  : Signal<boolean>
│   ├── loadingDelete : Signal<boolean>
│   ├── nameForm      : FormGroup   [name: required/minLength(2)]
│   └── emailForm     : FormGroup   [email: required/email]
└── metodos/
    ├── ngOnInit()       : void
    ├── updateName()     : void
    ├── updateEmail()    : void
    └── confirmDelete()  : void
```

---

## APP ROOT

---

### app.ts [component]

```
app.ts
├── funcao/ Componente raiz — define o layout principal com header fixo e router-outlet para as views de feature
```
