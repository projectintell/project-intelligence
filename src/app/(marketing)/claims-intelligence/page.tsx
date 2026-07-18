const DOCUMENT_TYPES = [
  'Tens of thousands of emails',
  'PDF correspondence',
  'Meeting minutes',
  'Site instructions',
  'Programmes',
  'Progress reports',
  'Drawings and photographs',
  'Contracts',
  'Spreadsheets',
  'Technical reports',
];

const ROLES = [
  {
    name: 'Claims Consultants',
    blurb: 'Build comprehensive chronologies in a fraction of the time.',
  },
  {
    name: 'Delay Experts',
    blurb: 'Locate instructions, notices, programme changes and key project events.',
  },
  {
    name: 'Quantum Experts',
    blurb: 'Identify commercial events affecting cost and entitlement.',
  },
  {
    name: 'Solicitors',
    blurb: 'Quickly understand complex evidence before advising clients.',
  },
  {
    name: 'Expert Witnesses',
    blurb: 'Work from an organised, evidence-backed chronology with complete traceability.',
  },
];

export default function ClaimsIntelligencePage() {
  return (
    <div className="py-16">
      {/* Hero */}
      <section>
        <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
          Claims Intelligence
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">
          Every claim has a story. Claims Intelligence helps you find the truth.
        </h1>
        <p className="mt-6 max-w-2xl text-slate-600">
          Claims Intelligence transforms thousands of project documents into
          structured, evidence-backed intelligence, automatically building an
          auditable chronology that helps professionals uncover the facts
          faster. By extracting key events from emails, letters, reports and
          project documentation, the platform surfaces the truth hidden
          within complex evidence.
        </p>
        <p className="mt-4 max-w-2xl text-slate-600">
          Spend less time reading documents and more time understanding what
          really happened.
        </p>
        <div className="mt-8 flex gap-4">
          <a
            href="mailto:trichmond@warmflamedevelopments.com?subject=Claims%20Intelligence%20demo"
            className="rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white"
          >
            Book a Demo
          </a>
          <a
            href="#how-it-works"
            className="rounded-md border border-slate-300 px-5 py-3 text-sm font-medium"
          >
            See How It Works
          </a>
        </div>
      </section>

      {/* The Challenge */}
      <section className="mt-20 border-t border-slate-100 pt-16">
        <h2 className="text-2xl font-bold">The challenge</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Construction disputes don&apos;t suffer from a lack of evidence.
          They suffer from too much of it. A typical construction claim can
          contain:
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-slate-600 sm:columns-2 sm:gap-x-12">
          {DOCUMENT_TYPES.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="mt-6 max-w-2xl text-slate-600">
          Somewhere within those documents lies the truth of what happened.
          Finding it can take weeks, sometimes months, of painstaking manual
          review. Important events are overlooked. Evidence becomes
          fragmented. Critical relationships between documents remain hidden.
          The result is valuable time spent organising information instead of
          analysing it.
        </p>
      </section>

      {/* The Solution */}
      <section className="mt-16 border-t border-slate-100 pt-16">
        <h2 className="text-2xl font-bold">The solution</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Claims Intelligence transforms documents into evidence. Rather than
          simply summarising files, it identifies individual project events
          and converts them into structured, searchable intelligence.
        </p>
        <p className="mt-3 max-w-2xl text-slate-600">
          Every document is analysed individually. Every significant event is
          extracted. Every event is linked back to its original evidence. The
          platform continuously builds a living chronology that lets teams
          understand the sequence of events and uncover the facts with
          confidence.
        </p>
      </section>

      {/* Truth Lives in the Evidence */}
      <section className="mt-16 border-t border-slate-100 pt-16">
        <h2 className="text-2xl font-bold">Truth lives in the evidence</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Construction claims are rarely won by opinion. They are won by
          evidence. By extracting and organising thousands of individual
          events, the platform helps professionals surface patterns, identify
          inconsistencies and build a clearer picture of what actually
          occurred throughout the life of a project.
        </p>
        <p className="mt-3 max-w-2xl text-slate-600">
          The technology doesn&apos;t decide who is right. It helps reveal
          the evidence so experienced professionals can.
        </p>
      </section>

      {/* Respond at speed */}
      <section className="mt-16 border-t border-slate-100 pt-16">
        <h2 className="text-2xl font-bold">Respond at the speed the claim demands</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          When you&apos;re on the receiving end of a claim — an Extension of
          Time notice, a compensation event, a global claim — the clock
          starts the moment it lands. Contractual response windows are often
          measured in days, not weeks, and missing one can mean losing the
          right to challenge, or a deemed acceptance of the other party&apos;s
          position.
        </p>
        <p className="mt-3 max-w-2xl text-slate-600">
          Rebuilding the evidence base from scratch under that pressure is
          where responding parties are most exposed. Claims Intelligence is
          built to compress that timeline. Because the platform continuously
          processes and structures documents as they&apos;re uploaded, a
          responding party can point it at the full project record — years of
          correspondence, instructions and programme revisions — and have a
          searchable, evidence-linked chronology ready in hours, not weeks.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-slate-600">
          <li>Instantly locate every notice, instruction or event relevant to the claim period.</li>
          <li>Cross-check the claiming party&apos;s narrative against the full documentary record within your response window.</li>
          <li>Identify missing notices, contradictions or gaps in the other side&apos;s evidence before you reply.</li>
          <li>Give your legal and commercial team a defensible evidence base early enough to actually use it.</li>
        </ul>
        <p className="mt-4 max-w-2xl text-slate-600">
          When timescales are set by the contract, not by how quickly you can
          read paperwork, that speed can be the difference between a
          considered response and a forced concession.
        </p>
      </section>

      {/* Why different */}
      <section className="mt-16 border-t border-slate-100 pt-16">
        <h2 className="text-2xl font-bold">Why Claims Intelligence is different</h2>
        <p className="mt-2 max-w-2xl font-medium text-slate-800">
          Built around evidence — not AI-generated summaries.
        </p>
        <p className="mt-3 max-w-2xl text-slate-600">
          Many AI tools produce impressive-looking summaries. The problem is
          they often lose the detail needed for professional claims work.
          Claims Intelligence works differently. Every extracted event
          remains permanently linked to:
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-slate-600">
          <li>the original document</li>
          <li>the author</li>
          <li>the document date</li>
          <li>the relevant extract</li>
          <li>the source location</li>
          <li>an AI confidence score</li>
        </ul>
        <p className="mt-4 max-w-2xl text-slate-600">
          Every conclusion remains fully traceable. Every event can be
          independently verified. Nothing disappears into a black box.
        </p>
        <p className="mt-3 max-w-2xl text-slate-600">
          We adopt the principle of Human in the Loop. Everything is verified
          by a professional — Claims Intelligence simply organises and
          surfaces the signals.
        </p>
      </section>

      {/* Clustering */}
      <section className="mt-16 border-t border-slate-100 pt-16">
        <h2 className="text-2xl font-bold">Clustering: from a single signal to the full picture</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Most tools stop at finding a document. Claims Intelligence goes
          further. Once it identifies a single signal — a delay notice, an
          instruction, a site record — the Chronicle Engine traces every
          event connected to it across the entire evidence base: not just
          documents that mention it directly, but the chain of consequence
          that follows from it.
        </p>
        <p className="mt-3 max-w-2xl text-slate-600">
          Take a single Employer&apos;s Instruction. On its own, it&apos;s one
          line in a chronology. But that instruction may have triggered a
          programme revision, which delayed a following trade, which
          generated a compensation event, which was then referenced in
          several progress reports and a site meeting minute. Read in
          isolation, each of those documents looks unremarkable. Read as a
          cluster, they become an evidenced chain of cause and effect — the
          kind of connected narrative that wins or loses a claim.
        </p>
        <p className="mt-3 max-w-2xl text-slate-600">
          Claims Intelligence builds these clusters automatically, linking
          every downstream event back to the primary signal that caused it.
          Instead of a consultant manually working out which documents relate
          to which, the platform surfaces the full web of related evidence in
          one view — ready to be reviewed, tested and relied upon. What used
          to take hours of cross-referencing becomes a single click: select a
          primary event, and see everything connected to it, with the full
          evidential trail intact.
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-slate-600">
          <li>Automatically surfaces the secondary and tertiary events triggered by a primary signal.</li>
          <li>Builds a defensible cause-and-effect chain, not just a list of related documents.</li>
          <li>Reveals knock-on consequences that manual review often misses.</li>
          <li>Turns a single piece of evidence into a fully evidenced narrative thread.</li>
        </ul>
      </section>

      {/* Built for construction professionals */}
      <section className="mt-16 border-t border-slate-100 pt-16">
        <h2 className="text-2xl font-bold">Built for construction professionals</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Claims Intelligence has been designed specifically for the way
          construction professionals investigate projects. Whether
          you&apos;re preparing a claim, responding to one, or acting as an
          independent expert, the platform provides a structured foundation
          for your analysis.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ROLES.map((role) => (
            <div key={role.name} className="rounded-lg border border-slate-200 p-6">
              <p className="font-medium">{role.name}</p>
              <p className="mt-2 text-sm text-slate-600">{role.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mt-16 border-t border-slate-100 pt-16">
        <h2 className="text-2xl font-bold">How it works</h2>

        <div className="mt-6">
          <p className="font-medium">1. Upload your project documents</p>
          <p className="mt-2 max-w-2xl text-slate-600">
            Simply upload emails, Outlook message files, PDFs, Word documents,
            Excel spreadsheets and project correspondence. No manual
            preparation required.
          </p>
        </div>

        <div className="mt-8">
          <p className="font-medium">2. AI extracts project events</p>
          <p className="mt-2 max-w-2xl text-slate-600">
            Every document is analysed individually. The platform
            automatically identifies events, dates, organisations, people,
            subjects, categories and supporting evidence. Each extracted
            event becomes part of a structured evidence database.
          </p>
        </div>

        <div className="mt-8">
          <p className="font-medium">3. Your chronology builds itself</p>
          <p className="mt-2 max-w-2xl text-slate-600">
            As documents are processed, Claims Intelligence continuously
            builds an evidence-backed chronology, with every event linked
            back to its source document. Instead of reading thousands of
            documents, you&apos;re navigating the project history.
          </p>
        </div>
      </section>

      {/* Surface the facts faster */}
      <section className="mt-16 border-t border-slate-100 pt-16">
        <h2 className="text-2xl font-bold">Surface the facts faster</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          When evidence is scattered across thousands of documents, important
          facts often remain hidden. Claims Intelligence connects those
          individual pieces together, giving a clearer understanding of what
          happened, when it happened, who was involved, what evidence
          supports it, and where that evidence originated.
        </p>
        <p className="mt-3 max-w-2xl text-slate-600">
          The platform helps professionals move from document review to
          evidence analysis more quickly, allowing the underlying truth of
          the project to emerge naturally from the available information.
        </p>
      </section>

      {/* Verifiable */}
      <section className="mt-16 border-t border-slate-100 pt-16">
        <h2 className="text-2xl font-bold">Every event is verifiable</h2>
        <p className="mt-3 max-w-2xl text-slate-600">Every extracted event records:</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-slate-600">
          <li>Original source document</li>
          <li>Supporting document extract</li>
          <li>Author</li>
          <li>Date</li>
          <li>Organisation</li>
          <li>Confidence score</li>
          <li>AI reasoning</li>
          <li>Direct link back to the evidence</li>
        </ul>
        <p className="mt-4 max-w-2xl text-slate-600">
          The result is a complete audit trail that professionals can trust.
        </p>
      </section>

      {/* Save hundreds of hours */}
      <section className="mt-16 border-t border-slate-100 pt-16">
        <h2 className="text-2xl font-bold">Save hundreds of hours</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Building project chronologies manually is one of the most
          time-consuming stages of any claim. Claims Intelligence automates
          the repetitive work while leaving professional judgement exactly
          where it belongs — with the consultant. Instead of spending weeks
          reading documents, your team can focus on:
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-slate-600">
          <li>Strategy</li>
          <li>Analysis</li>
          <li>Expert opinion</li>
          <li>Delay assessment</li>
          <li>Commercial evaluation</li>
          <li>Preparing stronger claims</li>
        </ul>
        <p className="mt-4 max-w-2xl text-slate-600">
          The platform doesn&apos;t replace expertise. It gives experts
          better information to work with.
        </p>
      </section>

      {/* Secure by design */}
      <section className="mt-16 border-t border-slate-100 pt-16">
        <h2 className="text-2xl font-bold">Secure by design</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Claims Intelligence has been designed for professional handling of
          sensitive project information. Documents remain linked to every
          extracted event, providing complete transparency and a fully
          auditable chain back to the original evidence. Your evidence
          remains structured, searchable and defensible throughout the
          lifecycle of a claim.
        </p>
      </section>

      {/* Why professionals choose */}
      <section className="mt-16 border-t border-slate-100 pt-16">
        <h2 className="text-2xl font-bold">Why professionals choose Claims Intelligence</h2>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-slate-600">
          <li>Automatically process thousands of project documents</li>
          <li>Build evidence-backed chronologies</li>
          <li>Extract events with full traceability</li>
          <li>Surface hidden patterns within complex evidence</li>
          <li>Reduce weeks of manual document review</li>
          <li>Improve consistency across claims</li>
          <li>Maintain complete auditability</li>
          <li>Help reveal the truth contained within the evidence</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="mt-16 border-t border-slate-100 pt-16">
        <h2 className="text-2xl font-bold">
          Every document tells part of the story. Claims Intelligence helps
          you see the whole picture.
        </h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Transform unstructured project documentation into structured,
          searchable evidence that enables your team to uncover the facts
          faster, build stronger claims, and make decisions with greater
          confidence.
        </p>
        <div className="mt-6">
          <a
            href="mailto:trichmond@warmflamedevelopments.com?subject=Claims%20Intelligence%20demo"
            className="rounded-md bg-slate-900 px-5 py-3 text-sm font-medium text-white"
          >
            Book your demonstration today
          </a>
        </div>
      </section>
    </div>
  );
}
