import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { quiz } from '../data/quiz.js';
import { useData } from '../lib/DataContext.jsx';
import { useT } from '../lib/i18n.jsx';
import { useLocal } from '../lib/localize.js';
import { PageHeader } from '../components/ui.jsx';
import { Motif, categoryIcon, motifFor } from '../components/Art.jsx';

// Highest total wins; ties go to the art form that scored first.
function scoreOf(answers) {
  const totals = {};
  answers.forEach((choice, qi) => {
    for (const [id, pts] of Object.entries(quiz[qi].a[choice].score)) totals[id] = (totals[id] ?? 0) + pts;
  });
  return Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0];
}

export default function Quiz() {
  const t = useT();
  const local = useLocal();
  const { artFormById } = useData();
  const [params, setParams] = useSearchParams();
  const [answers, setAnswers] = useState([]);
  const [copied, setCopied] = useState(false);
  const resultId = params.get('result');
  const result = artFormById[resultId];
  const step = answers.length;

  const answer = (i) => {
    const next = [...answers, i];
    if (next.length === quiz.length) {
      setParams({ result: scoreOf(next) }, { replace: true });
      setAnswers([]);
    } else setAnswers(next);
  };

  const share = async () => {
    const url = window.location.href;
    const text = `${t('quiz.result')} ${local.formName(result)}! · SPIC MACAY IIM Lucknow`;
    if (navigator.share) await navigator.share({ title: t('quiz.title'), text, url }).catch(() => {});
    else {
      await navigator.clipboard?.writeText(`${text} ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const Icon = result && (categoryIcon[result.category] ?? categoryIcon.other);

  return (
    <>
      <PageHeader eyebrow={t('quiz.eyebrow')} hindi="खेल" title={t('quiz.title')}>
        {t('quiz.lede')}
      </PageHeader>
      <section className="container quiz">
        {result ? (
          <article className={`card quiz-result has-motif cat-${result.category}`}>
            <Motif name={motifFor(result.category, 1)} className="lg" />
            <span className="form-detail-icon">
              <Icon size={64} />
            </span>
            <p className="eyebrow">{t('quiz.result')}</p>
            <h2>{local.formName(result)}</h2>
            <p className="lede">{local.formSummary(result)}</p>
            <div className="programme-actions">
              <Link className="btn btn-maroon" to={`/art-forms?form=${result.id}`}>
                {t('quiz.read')} {local.formName(result)} →
              </Link>
              <button className="btn btn-outline" onClick={share}>
                {copied ? t('quiz.copied') : t('quiz.share')}
              </button>
              <button className="btn btn-outline" onClick={() => setParams({}, { replace: true })}>
                {t('quiz.again')}
              </button>
            </div>
          </article>
        ) : (
          <article className="card quiz-card has-motif">
            <Motif name={['lotus', 'sitar', 'gateway', 'peacock', 'paisley', 'temple'][step]} className="lg" />
            <div className="quiz-progress" aria-hidden="true">
              <span style={{ width: `${(step / quiz.length) * 100}%` }} />
            </div>
            <p className="eyebrow">{t('quiz.question', { n: step + 1, total: quiz.length })}</p>
            <h2>{quiz[step].q}</h2>
            <div className="quiz-options">
              {quiz[step].a.map((a, i) => (
                <button key={a.text} className="quiz-option" onClick={() => answer(i)}>
                  {a.text}
                </button>
              ))}
            </div>
          </article>
        )}
      </section>
    </>
  );
}
