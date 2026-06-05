import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-10 pb-24 md:pb-10">
        {/* Back */}
        <Link href="/">
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </button>
        </Link>

        <article className="prose prose-slate max-w-none">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Política de Privacidad</h1>
          <p className="text-muted-foreground text-sm mb-8">
            <strong>placasperdidas.mx</strong> · placasperdidas.mx · Última actualización: junio de 2026
          </p>

          <Section title="1. Responsable del tratamiento">
            <p>
              El responsable del tratamiento de los datos personales recabados a través de la plataforma{" "}
              <strong>placasperdidas.mx</strong> (en adelante, "la Plataforma"), accesible en{" "}
              <strong>placasperdidas.mx</strong>, es <strong>placasperdidas.mx</strong> (en adelante,
              "el Responsable"). Para cualquier consulta relacionada con el tratamiento de sus datos, puede
              contactarnos a través de:{" "}
              <a href="mailto:privacidad.dondestanmisplacas@gmail.com" className="text-primary underline underline-offset-2">
                privacidad.dondestanmisplacas@gmail.com
              </a>
              .
            </p>
          </Section>

          <Section title="2. Datos que recopilamos">
            <p>La Plataforma recopila únicamente los datos estrictamente necesarios para prestar el servicio:</p>
            <table className="w-full text-sm border-collapse mt-3 mb-2">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 font-semibold text-foreground">Categoría</th>
                  <th className="text-left py-2 pr-4 font-semibold text-foreground">Datos recopilados</th>
                  <th className="text-left py-2 font-semibold text-foreground">Finalidad</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-foreground">Datos de registro</td>
                  <td className="py-2 pr-4">Nombre, correo electrónico, identificador OAuth (Google, Facebook)</td>
                  <td className="py-2">Crear y gestionar la cuenta</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-foreground">Datos de reporte</td>
                  <td className="py-2 pr-4">Número de placa, estado de la República, fecha, fotografía opcional</td>
                  <td className="py-2">Publicar y cruzar reportes</td>
                </tr>
                <tr className="border-b border-border/50">
                  <td className="py-2 pr-4 font-medium text-foreground">Mensajería</td>
                  <td className="py-2 pr-4">Contenido de mensajes internos</td>
                  <td className="py-2">Contacto seguro entre usuarios</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4 font-medium text-foreground">Datos técnicos</td>
                  <td className="py-2 pr-4">IP, navegador, páginas visitadas</td>
                  <td className="py-2">Seguridad y mejora del servicio</td>
                </tr>
              </tbody>
            </table>
            <p className="text-sm text-muted-foreground mt-2">
              La Plataforma <strong>no solicita ni almacena</strong> documentos de identidad, números de teléfono ni domicilios.
            </p>
          </Section>

          <Section title="3. Finalidad del tratamiento">
            <ul>
              <li><strong>Gestión de cuentas:</strong> registro, autenticación e identificación.</li>
              <li><strong>Publicación de reportes:</strong> cruce de placas perdidas y encontradas.</li>
              <li><strong>Mensajería interna segura:</strong> comunicación sin exponer datos personales.</li>
              <li><strong>Notificaciones:</strong> alertar al usuario cuando se reporte su placa.</li>
              <li><strong>Seguridad:</strong> detección y prevención de usos indebidos.</li>
              <li><strong>Mejora del servicio:</strong> análisis estadístico agregado y anónimo.</li>
            </ul>
          </Section>

          <Section title="4. Base legal del tratamiento">
            <p>
              El tratamiento se fundamenta en la <strong>Ley Federal de Protección de Datos Personales en Posesión
              de los Particulares (LFPDPPP)</strong> de los Estados Unidos Mexicanos, bajo las bases de
              consentimiento del titular, ejecución de la relación jurídica e interés legítimo para la seguridad
              de la Plataforma.
            </p>
          </Section>

          <Section title="5. Privacidad por diseño en el flujo de contacto">
            <p>
              En ningún momento se exponen datos personales identificables en el listado público de placas ni en
              el sistema de mensajería. Los usuarios se identifican mediante <strong>alias anónimos</strong>{" "}
              generados automáticamente. Toda comunicación ocurre exclusivamente a través de la mensajería
              interna de la Plataforma.
            </p>
          </Section>

          <Section title="6. Conservación de los datos">
            <p>
              Los datos se conservarán mientras el usuario mantenga su cuenta activa. Tras solicitar la
              eliminación de la cuenta, los datos serán suprimidos en un plazo máximo de <strong>30 días
              naturales</strong>. Los registros internos de reportes cerrados podrán conservarse por razones de
              auditoría durante un máximo de <strong>12 meses</strong> adicionales.
            </p>
          </Section>

          <Section title="7. Transferencia de datos a terceros">
            <p>
              La Plataforma <strong>no vende, alquila ni cede</strong> datos personales a terceros con fines
              comerciales. Los datos únicamente se comparten con proveedores tecnológicos bajo acuerdos de
              confidencialidad, o con autoridades competentes cuando lo exija la legislación mexicana.
            </p>
          </Section>

          <Section title="8. Cookies">
            <p>
              Se utilizan exclusivamente <strong>cookies de sesión</strong> necesarias para la autenticación.
              No se emplean cookies de rastreo publicitario ni se comparten datos con redes de publicidad.
            </p>
          </Section>

          <Section title="9. Derechos ARCO">
            <p>
              De conformidad con la LFPDPPP, el titular tiene derecho de <strong>Acceso, Rectificación,
              Cancelación y Oposición</strong> sobre sus datos. Para ejercerlos, envíe una solicitud a{" "}
              <a href="mailto:privacidad.dondestanmisplacas@gmail.com" className="text-primary underline underline-offset-2">
                privacidad.dondestanmisplacas@gmail.com
              </a>{" "}
              indicando su nombre completo, correo de registro y el derecho que desea ejercer. La solicitud será
              atendida en un plazo máximo de <strong>20 días hábiles</strong>.
            </p>
          </Section>

          <Section title="10. Seguridad">
            <p>
              Se implementan medidas técnicas y organizativas adecuadas: cifrado HTTPS, almacenamiento seguro
              de credenciales y control de acceso a sistemas internos.
            </p>
          </Section>

          <Section title="11. Modificaciones">
            <p>
              El Responsable se reserva el derecho de actualizar esta Política en cualquier momento. Los cambios
              se publicarán en esta página con la fecha de actualización. El uso continuado de la Plataforma
              implica la aceptación de la Política actualizada.
            </p>
          </Section>

          <Section title="12. Legislación aplicable y jurisdicción">
            <p>
              Esta Política se rige por la legislación de los <strong>Estados Unidos Mexicanos</strong>,
              en particular la LFPDPPP y su Reglamento. Las controversias se someten a los tribunales
              competentes de la <strong>Ciudad de México</strong>.
            </p>
          </Section>

          <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground">
            Contacto: <a href="mailto:privacidad.dondestanmisplacas@gmail.com" className="underline underline-offset-2">privacidad.dondestanmisplacas@gmail.com</a>
          </div>
        </article>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-serif text-xl font-semibold text-foreground mb-3">{title}</h2>
      <div className="text-muted-foreground leading-relaxed space-y-2">{children}</div>
    </section>
  );
}
