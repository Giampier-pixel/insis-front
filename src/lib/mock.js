export const COURSES = [
  { id:1, title:'Liderazgo de Equipos', category:'Management', level:'Avanzado', duration:'8h 30m', enrolled:1240, rating:4.8, progress:65, instructor:'Ana Vargas', lessons:12, published:true },
  { id:2, title:'Excel Avanzado para Negocios', category:'Herramientas', level:'Intermedio', duration:'5h 15m', enrolled:3820, rating:4.9, progress:100, instructor:'Carlos Mendoza', lessons:9, published:true },
  { id:3, title:'Comunicación Efectiva', category:'Habilidades', level:'Básico', duration:'3h 45m', enrolled:2100, rating:4.7, progress:30, instructor:'María Rojo', lessons:7, published:true },
  { id:4, title:'Seguridad Industrial', category:'Compliance', level:'Intermedio', duration:'6h 00m', enrolled:980, rating:4.6, progress:0, instructor:'Jorge León', lessons:10, published:false },
  { id:5, title:'Power BI Empresarial', category:'Análisis', level:'Intermedio', duration:'7h 20m', enrolled:1560, rating:4.9, progress:15, instructor:'Sofía Paredes', lessons:14, published:true },
  { id:6, title:'Gestión de Proyectos Ágiles', category:'Management', level:'Avanzado', duration:'9h 10m', enrolled:870, rating:4.7, progress:0, instructor:'Roberto Paz', lessons:16, published:false },
];

export const QUIZ_QUESTIONS = [
  { text:'¿Cuál es el principal objetivo de un equipo de alto rendimiento?', options:['Maximizar ganancias','Alcanzar metas superando expectativas','Reducir costos operativos','Cumplir horarios establecidos'], correct:1 },
  { text:'¿Qué define a un líder situacional?', options:['Mantiene siempre el mismo estilo','Adapta su estilo según el colaborador','Delega todas las decisiones','Toma decisiones unilateralmente'], correct:1 },
  { text:'En la Pirámide de Lencioni, ¿cuál es la base disfuncional?', options:['Falta de resultados','Ausencia de confianza','Miedo al conflicto','Falta de compromiso'], correct:1 },
  { text:'¿Qué modelo describe las etapas de Tuckman?', options:['Planear, Hacer, Verificar, Actuar','Forming, Storming, Norming, Performing','Iniciar, Planificar, Ejecutar, Cerrar','Explorar, Alinear, Implementar, Evaluar'], correct:1 },
];

export const EMPLOYEES = [
  { id:1, name:'Lucía Fernández', dept:'Operaciones', role:'Analista Sr.', email:'l.fernandez@corp.com', completed:8, assigned:10, pct:80, status:'ok' },
  { id:2, name:'Marco Delgado', dept:'Ventas', role:'Ejecutivo', email:'m.delgado@corp.com', completed:3, assigned:10, pct:30, status:'warn' },
  { id:3, name:'Daniela Cruz', dept:'RR.HH.', role:'Coordinadora', email:'d.cruz@corp.com', completed:10, assigned:10, pct:100, status:'done' },
  { id:4, name:'Andrés Torres', dept:'Finanzas', role:'Controller', email:'a.torres@corp.com', completed:1, assigned:6, pct:17, status:'risk' },
  { id:5, name:'Valeria Santos', dept:'TI', role:'Desarrolladora', email:'v.santos@corp.com', completed:5, assigned:7, pct:71, status:'ok' },
  { id:6, name:'Héctor Ramírez', dept:'Operaciones', role:'Supervisor', email:'h.ramirez@corp.com', completed:0, assigned:4, pct:0, status:'risk' },
  { id:7, name:'Patricia Gómez', dept:'Legal', role:'Abogada Sr.', email:'p.gomez@corp.com', completed:6, assigned:6, pct:100, status:'done' },
];

export const DEPT_DATA = [
  { dept:'Operaciones', pct:62 },
  { dept:'Ventas', pct:45 },
  { dept:'RR.HH.', pct:88 },
  { dept:'Finanzas', pct:37 },
  { dept:'TI', pct:74 },
  { dept:'Legal', pct:91 },
];

export const ASSIGNMENTS = [
  { id:1, title:'Inducción Corporativa 2025', course:'Liderazgo de Equipos', dept:'Todos', deadline:'30 Jun 2025', targets:142, done:96, pct:68, status:'active' },
  { id:2, title:'Compliance Obligatorio Q1', course:'Seguridad Industrial', dept:'Operaciones', deadline:'15 May 2025', targets:28, done:8, pct:29, status:'overdue' },
  { id:3, title:'Excel para Finanzas', course:'Excel Avanzado', dept:'Finanzas', deadline:'20 Jul 2025', targets:18, done:14, pct:78, status:'active' },
];

export const LESSONS_BASE = [
  { id:1, order:1, title:'Introducción al liderazgo situacional', type:'video', duration:'18 min', done:true },
  { id:2, order:2, title:'La Pirámide de Lencioni', type:'video', duration:'22 min', done:true },
  { id:3, order:3, title:'Quiz: Fundamentos', type:'quiz', duration:'10 min', done:false },
  { id:4, order:4, title:'Formación de equipos: Tuckman', type:'video', duration:'25 min', done:false },
];
