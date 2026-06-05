import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Terminos() {
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
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Términos y Condiciones de Uso</h1>
          <p className="text-muted-foreground text-sm mb-8">
            <strong>¿Dónde están mis placas?</strong> · dondestanmisplacas.com · Última actualización: junio de 2026
          </p>

          <Section title="1. Aceptación de los términos">
            <p>
              El acceso y uso de la plataforma <strong>¿Dónde están mis placas?</strong>, disponible en{" "}
              <strong>dondestanmisplacas.com</strong>, implica la aceptación plena y sin reservas de los
              presentes Términos y Condiciones de Uso. Si el usuario no está de acuerdo con alguna de las
              disposiciones aquí establecidas, deberá abstenerse de utilizar la Plataforma.
            </p>
            <p>
              <strong>dondestanmisplacas.com</strong> (en adelante, "el Titular") se reserva el derecho de
              modificar estos Términos en cualquier momento. El uso continuado de la Plataforma tras la
              publicación de cambios constituye su aceptación.
            </p>
          </Section>

          <Section title="2. Descripción del servicio">
            <p>
              <strong>¿Dónde están mis placas?</strong> es una plataforma digital que permite a los usuarios:
            </p>
            <ul>
              <li><strong>Reportar una placa perdida:</strong> publicar el número de placa y el estado de la República donde se perdió.</li>
              <li><strong>Reportar una placa encontrada:</strong> publicar el número, estado y fotografía opcional para que el dueño pueda reclamarla.</li>
              <li><strong>Buscar placas:</strong> consultar el listado de placas encontradas o buscar por número para cruzar reportes.</li>
              <li><strong>Contactar de forma segura:</strong> comunicarse con la otra parte a través de mensajería interna, sin exponer datos personales.</li>
            </ul>
            <p>
              La Plataforma actúa exclusivamente como <strong>intermediario tecnológico</strong>. El Titular no
              es responsable de la veracidad de los reportes ni del resultado de las gestiones entre usuarios.
            </p>
          </Section>

          <Section title="3. Registro y cuenta de usuario">
            <p>
              Para publicar reportes y usar la mensajería, el usuario debe crear una cuenta mediante los métodos
              disponibles (Google, Facebook o correo electrónico). El usuario se compromete a:
            </p>
            <ul>
              <li>Proporcionar información veraz y actualizada al registrarse.</li>
              <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
              <li>Notificar al Titular ante cualquier uso no autorizado de su cuenta.</li>
              <li>No ceder ni transferir su cuenta a terceros.</li>
            </ul>
            <p>
              El Titular se reserva el derecho de suspender o cancelar cuentas que incumplan estos Términos,
              sin previo aviso.
            </p>
          </Section>

          <Section title="4. Uso aceptable de la Plataforma">
            <p>Queda <strong>expresamente prohibido</strong>:</p>
            <ul>
              <li>Publicar reportes falsos, fraudulentos o con información incorrecta sobre placas vehiculares.</li>
              <li>Utilizar la Plataforma para actividades ilícitas, incluyendo el encubrimiento de robo de vehículos o placas.</li>
              <li>Acosar, amenazar o intimidar a otros usuarios a través de la mensajería interna.</li>
              <li>Intentar obtener datos personales de otros usuarios por medios no previstos en la Plataforma.</li>
              <li>Publicar contenido ofensivo, discriminatorio, obsceno o que vulnere derechos de terceros.</li>
              <li>Realizar acciones que comprometan la seguridad o disponibilidad de la Plataforma.</li>
              <li>Crear cuentas múltiples para eludir restricciones o sanciones.</li>
              <li>Utilizar la Plataforma con fines comerciales no autorizados por el Titular.</li>
            </ul>
          </Section>

          <Section title="5. Contenido publicado por los usuarios">
            <p>
              El usuario es el único responsable del contenido que publique. Al hacerlo, declara que es titular
              de los derechos sobre dicho contenido, que no infringe derechos de terceros y que la información
              es veraz. El Titular se reserva el derecho de eliminar contenido que incumpla estos Términos o la
              legislación aplicable.
            </p>
          </Section>

          <Section title="6. Privacidad y protección de datos">
            <p>
              El tratamiento de datos personales se rige por la{" "}
              <Link href="/privacidad">
                <span className="text-primary underline underline-offset-2 cursor-pointer">Política de Privacidad</span>
              </Link>
              , disponible en <strong>dondestanmisplacas.com/privacidad</strong>, que forma parte integrante de
              estos Términos. En ningún momento se exponen datos personales identificables en el listado público
              ni en la mensajería interna.
            </p>
          </Section>

          <Section title="7. Propiedad intelectual">
            <p>
              Todos los elementos de la Plataforma —diseño, logotipos, textos, código fuente y funcionalidades—
              son propiedad exclusiva del Titular o de sus licenciantes. Queda prohibida su reproducción,
              distribución o uso comercial sin autorización expresa y por escrito del Titular.
            </p>
          </Section>

          <Section title="8. Limitación de responsabilidad">
            <p>La Plataforma actúa como intermediario tecnológico y <strong>no garantiza</strong>:</p>
            <ul>
              <li>La veracidad o exactitud de los reportes publicados por los usuarios.</li>
              <li>La recuperación efectiva de las placas vehiculares reportadas.</li>
              <li>La disponibilidad ininterrumpida del servicio.</li>
              <li>Los resultados de las gestiones entre usuarios a través de la mensajería.</li>
            </ul>
            <p>
              El Titular no será responsable por daños directos, indirectos o consecuentes derivados del uso
              o la imposibilidad de uso de la Plataforma.
            </p>
          </Section>

          <Section title="9. Indemnización">
            <p>
              El usuario acepta indemnizar y mantener indemne al Titular frente a cualquier reclamación, daño
              o gasto derivado del incumplimiento de estos Términos, del uso indebido de la Plataforma o de
              la violación de derechos de terceros.
            </p>
          </Section>

          <Section title="10. Suspensión y cancelación del servicio">
            <p>
              El Titular se reserva el derecho de suspender o cancelar el acceso de cualquier usuario que
              incumpla estos Términos, así como de modificar, suspender o discontinuar la Plataforma en
              cualquier momento y sin previo aviso.
            </p>
          </Section>

          <Section title="11. Menores de edad">
            <p>
              La Plataforma está dirigida a personas mayores de <strong>18 años</strong>. Los menores no están
              autorizados a registrarse sin el consentimiento expreso de sus padres o tutores legales.
            </p>
          </Section>

          <Section title="12. Legislación aplicable y jurisdicción">
            <p>
              Estos Términos se rigen por la legislación de los <strong>Estados Unidos Mexicanos</strong>. Las
              controversias se someten a los tribunales competentes de la <strong>Ciudad de México</strong>,
              renunciando a cualquier otro fuero.
            </p>
          </Section>

          <Section title="13. Contacto">
            <p>
              Para consultas o reclamaciones relacionadas con estos Términos:{" "}
              <a href="mailto:privacidad.dondestanmisplacas@gmail.com" className="text-primary underline underline-offset-2">
                privacidad.dondestanmisplacas@gmail.com
              </a>{" "}
              · dondestanmisplacas.com
            </p>
          </Section>

          <div className="mt-10 pt-6 border-t border-border text-xs text-muted-foreground">
            Versión vigente desde junio de 2026. Todos los derechos reservados — <strong>¿Dónde están mis placas?</strong>
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
