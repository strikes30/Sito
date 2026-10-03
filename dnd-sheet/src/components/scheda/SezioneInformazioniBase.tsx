import lingue from "../../data/lingue.json";
import type { CompetenzaArmatura } from "../../types/dnd";
import { etichetteCompetenzeArmatura } from "../../utils/etichetteDnD";

type SottoclasseDisponibile = {
  id: string;
  nome: string;
  classeId: string;
};

type SezioneInformazioniBaseProps = {
  nome: string;
  livello: number;
  onSaliDiLivello: () => void;
  bonusCompetenza: number;

  nomeClasse: string | undefined;
  competenzeArmatura: CompetenzaArmatura[];
  sottoclasseId: string;
  onCambiaSottoclasse: (id: string) => void;
  sottoclassiDisponibili: SottoclasseDisponibile[];

  dadoVita: number | undefined;
  puntiFeritaMassimi: number | null;
  classeArmatura: number | null;

  nomeRazza: string | undefined;
  nomeSottorazza: string | undefined;
  tipoCreatura: string | undefined;
  taglia: string;
  velocita: number | undefined;

  primaLinguaId: string;
  secondaLinguaId: string;

  nomeBackground: string | undefined;
  descrizioneBackground: string | undefined;
};

export default function SezioneInformazioniBase({
  nome,
  livello,
  onSaliDiLivello,
  bonusCompetenza,
  nomeClasse,
  competenzeArmatura,
  sottoclasseId,
  onCambiaSottoclasse,
  sottoclassiDisponibili,
  dadoVita,
  puntiFeritaMassimi,
  classeArmatura,
  nomeRazza,
  nomeSottorazza,
  tipoCreatura,
  taglia,
  velocita,
  primaLinguaId,
  secondaLinguaId,
  nomeBackground,
  descrizioneBackground,
}: SezioneInformazioniBaseProps) {
  return (
    <section>
      <h1>Scheda del personaggio</h1>

      <p>Livello: {livello}</p>

      <button
        type="button"
        onClick={onSaliDiLivello}
        disabled={livello >= 20}
      >
        Sali di livello
      </button>

      <p>Bonus di competenza: +{bonusCompetenza}</p>

      <h2>{nome}</h2>
      <p>Classe: {nomeClasse}</p>

      {livello >= 3 && sottoclassiDisponibili.length > 0 && (
        <div>
          <label htmlFor="sottoclasse">Sottoclasse</label>

          <select
            id="sottoclasse"
            value={sottoclasseId}
            onChange={(evento) => onCambiaSottoclasse(evento.target.value)}
          >
            <option value="">Seleziona una sottoclasse</option>

            {sottoclassiDisponibili.map((sottoclasse) => (
              <option key={sottoclasse.id} value={sottoclasse.id}>
                {sottoclasse.nome}
              </option>
            ))}
          </select>
        </div>
      )}
      <div>
        <h3>Competenze armatura</h3>
        {competenzeArmatura.length === 0 ? (
          <p>Nessuna competenza con armature</p>
        ) : (
          <ul>
            {competenzeArmatura.map((competenza) => (
              <li key={competenza}>
                {etichetteCompetenzeArmatura[competenza]}
              </li>
            ))}
          </ul>
        )}
      </div>
      <p>
        Dado vita: {dadoVita === undefined ? "—" : `d${dadoVita}`}
      </p>

      <p>
        Punti ferita massimi: {puntiFeritaMassimi ?? "—"}
      </p>

      <p>
        Classe armatura: {classeArmatura ?? "—"}
      </p>

      <p>Razza: {nomeRazza}</p>

      {nomeSottorazza && (
        <p>Sottorazza: {nomeSottorazza}</p>
      )}

      <p>
        Background:{" "}
        <span title={descrizioneBackground ?? ""}>
          {nomeBackground ?? "—"}
        </span>
      </p>

      <p>Tipo di creatura: {tipoCreatura}</p>
      <p>Taglia: {taglia}</p>

      <p>
        Velocità:{" "}
        {velocita === undefined ? "—" : `${velocita} piedi`}
      </p>

      <h2>Lingue conosciute</h2>

      <ul>
        <li>Comune</li>
        <li>
          {lingue.find((lingua) => lingua.id === primaLinguaId)?.nome}
        </li>
        <li>
          {lingue.find((lingua) => lingua.id === secondaLinguaId)?.nome}
        </li>
      </ul>
    </section>
  );
}