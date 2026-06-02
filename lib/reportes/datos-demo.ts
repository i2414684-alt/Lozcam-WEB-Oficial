// Datos de DEMOSTRACIÓN para el reporte en Excel.
// Coinciden con el esquema real (enums de obras, pagos, solicitudes).
//
// 👉 Para usar tus datos REALES de Supabase en vez de estos de ejemplo,
//    reemplaza el cuerpo de getDatosReporte() por la versión comentada
//    al final de este archivo.

export const TIPO_SERVICIO: Record<string, string> = {
  construccion: 'Construcción', topografia: 'Topografía', arquitectura: 'Arquitectura',
  instalaciones: 'Instalaciones', supervision: 'Supervisión', habilitacion_urbana: 'Habilitación Urbana',
}
export const ESTADO_OBRA: Record<string, string> = {
  formulacion: 'Formulación', licitacion: 'Licitación', contratada: 'Contratada', en_ejecucion: 'En Ejecución',
  paralizada: 'Paralizada', en_liquidacion: 'En Liquidación', completada: 'Completada', cancelada: 'Cancelada',
}
export const METODO_PAGO: Record<string, string> = {
  efectivo: 'Efectivo', transferencia_bancaria: 'Transferencia Bancaria', deposito_bancario: 'Depósito Bancario',
  cheque: 'Cheque', yape: 'Yape', plin: 'Plin', tarjeta_credito: 'Tarjeta de Crédito', tarjeta_debito: 'Tarjeta de Débito',
}
export const ESTADO_PAGO: Record<string, string> = {
  pendiente: 'Pendiente', verificando: 'Verificando', pagado: 'Pagado', rechazado: 'Rechazado', reembolsado: 'Reembolsado',
}
export const ESTADO_SOLICITUD: Record<string, string> = {
  nueva: 'Nueva', cita_agendada: 'Cita agendada', en_revision: 'En revisión', cotizando: 'Cotizando',
  cotizacion_enviada: 'Cotización enviada', negociando: 'Negociando', aprobada: 'Aprobada',
  rechazada: 'Rechazada', convertida_obra: 'Convertida a obra',
}
export const PRIORIDAD: Record<string, string> = {
  baja: 'Baja', media: 'Media', alta: 'Alta', critica: 'Crítica',
}

export interface ObraRep { codigo: string; nombre: string; cliente: string; tipo_servicio: string; estado: string; distrito: string; area_m2: number; monto_contrato: number; avance: number }
export interface PagoRep { fecha: string; concepto: string; obra: string; cliente: string; metodo_pago: string; estado: string; monto: number }
export interface ClienteRep { tipo: string; nombre: string; documento: string; email: string; telefono: string; distrito: string; activo: boolean }
export interface SolicitudRep { fecha: string; titulo: string; cliente: string; tipo_servicio: string; estado: string; prioridad: string; presupuesto_ref: number }

export const obrasDemo: ObraRep[] = [
  { codigo: 'OBR-2025-001', nombre: 'Edificio Corporativo San Isidro', cliente: 'Inversiones Andina S.A.C.', tipo_servicio: 'construccion', estado: 'en_ejecucion', distrito: 'San Isidro', area_m2: 4200, monto_contrato: 3850000, avance: 78 },
  { codigo: 'OBR-2025-002', nombre: 'Conjunto Residencial Surco', cliente: 'Constructora del Sur S.A.C.', tipo_servicio: 'construccion', estado: 'en_ejecucion', distrito: 'Santiago de Surco', area_m2: 6800, monto_contrato: 5200000, avance: 45 },
  { codigo: 'OBR-2025-003', nombre: 'Planta Industrial Lurín', cliente: 'Logística Pacífico S.A.', tipo_servicio: 'construccion', estado: 'contratada', distrito: 'Lurín', area_m2: 9500, monto_contrato: 7300000, avance: 10 },
  { codigo: 'OBR-2025-004', nombre: 'Remodelación Comercial Miraflores', cliente: 'Retail Perú S.A.C.', tipo_servicio: 'arquitectura', estado: 'en_ejecucion', distrito: 'Miraflores', area_m2: 1200, monto_contrato: 980000, avance: 62 },
  { codigo: 'OBR-2025-005', nombre: 'Levantamiento Topográfico Cañete', cliente: 'Agroindustria Valle Grande S.A.', tipo_servicio: 'topografia', estado: 'completada', distrito: 'San Vicente de Cañete', area_m2: 25000, monto_contrato: 145000, avance: 100 },
  { codigo: 'OBR-2025-006', nombre: 'Supervisión Vía San Borja', cliente: 'Municipalidad de San Borja', tipo_servicio: 'supervision', estado: 'en_ejecucion', distrito: 'San Borja', area_m2: 0, monto_contrato: 320000, avance: 55 },
  { codigo: 'OBR-2025-007', nombre: 'Habilitación Urbana Pachacámac', cliente: 'Inmobiliaria Horizonte S.A.C.', tipo_servicio: 'habilitacion_urbana', estado: 'formulacion', distrito: 'Pachacámac', area_m2: 48000, monto_contrato: 2100000, avance: 0 },
  { codigo: 'OBR-2025-008', nombre: 'Instalaciones Eléctricas Ate', cliente: 'Industrias Metálicas Ate S.A.C.', tipo_servicio: 'instalaciones', estado: 'paralizada', distrito: 'Ate', area_m2: 3000, monto_contrato: 670000, avance: 30 },
]

export const pagosDemo: PagoRep[] = [
  { fecha: '2025-01-15', concepto: 'Adelanto 40% de contrato', obra: 'Edificio Corporativo San Isidro', cliente: 'Inversiones Andina S.A.C.', metodo_pago: 'transferencia_bancaria', estado: 'pagado', monto: 1540000 },
  { fecha: '2025-02-12', concepto: 'Valorización N°1', obra: 'Edificio Corporativo San Isidro', cliente: 'Inversiones Andina S.A.C.', metodo_pago: 'transferencia_bancaria', estado: 'pagado', monto: 770000 },
  { fecha: '2025-03-14', concepto: 'Valorización N°2', obra: 'Edificio Corporativo San Isidro', cliente: 'Inversiones Andina S.A.C.', metodo_pago: 'deposito_bancario', estado: 'verificando', monto: 615000 },
  { fecha: '2025-02-20', concepto: 'Adelanto 30% de contrato', obra: 'Conjunto Residencial Surco', cliente: 'Constructora del Sur S.A.C.', metodo_pago: 'transferencia_bancaria', estado: 'pagado', monto: 1560000 },
  { fecha: '2025-03-22', concepto: 'Valorización N°1', obra: 'Conjunto Residencial Surco', cliente: 'Constructora del Sur S.A.C.', metodo_pago: 'deposito_bancario', estado: 'pagado', monto: 780000 },
  { fecha: '2025-04-05', concepto: 'Valorización N°2', obra: 'Conjunto Residencial Surco', cliente: 'Constructora del Sur S.A.C.', metodo_pago: 'cheque', estado: 'pendiente', monto: 624000 },
  { fecha: '2025-03-18', concepto: 'Adelanto de materiales', obra: 'Planta Industrial Lurín', cliente: 'Logística Pacífico S.A.', metodo_pago: 'transferencia_bancaria', estado: 'pendiente', monto: 2190000 },
  { fecha: '2025-02-28', concepto: 'Adelanto 50%', obra: 'Remodelación Comercial Miraflores', cliente: 'Retail Perú S.A.C.', metodo_pago: 'transferencia_bancaria', estado: 'pagado', monto: 490000 },
  { fecha: '2025-03-30', concepto: 'Saldo final', obra: 'Remodelación Comercial Miraflores', cliente: 'Retail Perú S.A.C.', metodo_pago: 'yape', estado: 'pendiente', monto: 147000 },
  { fecha: '2025-01-31', concepto: 'Pago único - levantamiento', obra: 'Levantamiento Topográfico Cañete', cliente: 'Agroindustria Valle Grande S.A.', metodo_pago: 'transferencia_bancaria', estado: 'pagado', monto: 145000 },
  { fecha: '2025-02-15', concepto: 'Cuota mensual supervisión', obra: 'Supervisión Vía San Borja', cliente: 'Municipalidad de San Borja', metodo_pago: 'transferencia_bancaria', estado: 'pagado', monto: 64000 },
  { fecha: '2025-03-15', concepto: 'Cuota mensual supervisión', obra: 'Supervisión Vía San Borja', cliente: 'Municipalidad de San Borja', metodo_pago: 'transferencia_bancaria', estado: 'pagado', monto: 64000 },
]

export const clientesDemo: ClienteRep[] = [
  { tipo: 'Jurídica', nombre: 'Inversiones Andina S.A.C.', documento: 'RUC 20512345678', email: 'contacto@andina.pe', telefono: '(01) 450-1234', distrito: 'San Isidro', activo: true },
  { tipo: 'Jurídica', nombre: 'Constructora del Sur S.A.C.', documento: 'RUC 20487654321', email: 'ventas@cdelsur.pe', telefono: '(01) 271-8890', distrito: 'Santiago de Surco', activo: true },
  { tipo: 'Jurídica', nombre: 'Logística Pacífico S.A.', documento: 'RUC 20445566778', email: 'proyectos@logpacifico.pe', telefono: '(01) 430-2200', distrito: 'Lurín', activo: true },
  { tipo: 'Jurídica', nombre: 'Retail Perú S.A.C.', documento: 'RUC 20399887766', email: 'obras@retailperu.pe', telefono: '(01) 445-9090', distrito: 'Miraflores', activo: true },
  { tipo: 'Jurídica', nombre: 'Agroindustria Valle Grande S.A.', documento: 'RUC 20322114455', email: 'admin@vallegrande.pe', telefono: '(056) 58-1200', distrito: 'San Vicente de Cañete', activo: true },
  { tipo: 'Jurídica', nombre: 'Inmobiliaria Horizonte S.A.C.', documento: 'RUC 20566778899', email: 'contacto@horizonte.pe', telefono: '(01) 366-7711', distrito: 'Pachacámac', activo: true },
  { tipo: 'Natural', nombre: 'Carlos Rojas Méndez', documento: 'DNI 41234567', email: 'carlos.rojas@gmail.com', telefono: '987 654 321', distrito: 'La Molina', activo: true },
  { tipo: 'Natural', nombre: 'María Quispe Huamán', documento: 'DNI 45678912', email: 'maria.quispe@outlook.com', telefono: '965 321 478', distrito: 'Ate', activo: false },
]

export const solicitudesDemo: SolicitudRep[] = [
  { fecha: '2025-04-02', titulo: 'Construcción de almacén logístico', cliente: 'Logística Pacífico S.A.', tipo_servicio: 'construccion', estado: 'cotizando', prioridad: 'alta', presupuesto_ref: 2800000 },
  { fecha: '2025-04-10', titulo: 'Casa de playa en Asia', cliente: 'Carlos Rojas Méndez', tipo_servicio: 'construccion', estado: 'nueva', prioridad: 'media', presupuesto_ref: 950000 },
  { fecha: '2025-03-28', titulo: 'Topografía de terreno en Chilca', cliente: 'Inmobiliaria Horizonte S.A.C.', tipo_servicio: 'topografia', estado: 'aprobada', prioridad: 'media', presupuesto_ref: 120000 },
  { fecha: '2025-04-12', titulo: 'Remodelación de oficinas', cliente: 'Retail Perú S.A.C.', tipo_servicio: 'arquitectura', estado: 'en_revision', prioridad: 'alta', presupuesto_ref: 430000 },
  { fecha: '2025-03-20', titulo: 'Supervisión de obra menor', cliente: 'Municipalidad de San Borja', tipo_servicio: 'supervision', estado: 'cotizacion_enviada', prioridad: 'baja', presupuesto_ref: 85000 },
  { fecha: '2025-04-15', titulo: 'Instalaciones sanitarias edificio', cliente: 'Inversiones Andina S.A.C.', tipo_servicio: 'instalaciones', estado: 'nueva', prioridad: 'critica', presupuesto_ref: 260000 },
  { fecha: '2025-04-08', titulo: 'Habilitación urbana 5 ha', cliente: 'Inmobiliaria Horizonte S.A.C.', tipo_servicio: 'habilitacion_urbana', estado: 'negociando', prioridad: 'alta', presupuesto_ref: 3100000 },
  { fecha: '2025-03-25', titulo: 'Levantamiento catastral', cliente: 'Agroindustria Valle Grande S.A.', tipo_servicio: 'topografia', estado: 'aprobada', prioridad: 'media', presupuesto_ref: 98000 },
]

export async function getDatosReporte() {
  return { obras: obrasDemo, pagos: pagosDemo, clientes: clientesDemo, solicitudes: solicitudesDemo }
}

/*
// ───────────── VERSIÓN CON DATOS REALES DE SUPABASE ─────────────
// Reemplaza la función de arriba por esta cuando quieras exportar tu BD real.
//
// import { createClient } from '@/lib/supabase/server'
//
// export async function getDatosReporte() {
//   const supabase = await createClient()
//   const [obras, pagos, clientes, solicitudes] = await Promise.all([
//     supabase.from('obras').select('codigo, nombre, tipo_servicio, estado, distrito, area_m2, monto_contrato, clientes(razon_social, nombres, apellidos)'),
//     supabase.from('pagos_clientes').select('fecha_pago, concepto, monto, metodo_pago, estado, obras(nombre), clientes(razon_social, nombres, apellidos)'),
//     supabase.from('clientes').select('tipo_persona, nombres, apellidos, razon_social, dni, ruc, email, telefono, distrito, activo'),
//     supabase.from('solicitudes').select('created_at, titulo, tipo_servicio, estado, prioridad, presupuesto_ref, clientes(razon_social, nombres, apellidos)'),
//   ])
//   // ...mapea cada fila al shape ObraRep / PagoRep / ClienteRep / SolicitudRep...
//   return { obras: [], pagos: [], clientes: [], solicitudes: [] }
// }
*/
