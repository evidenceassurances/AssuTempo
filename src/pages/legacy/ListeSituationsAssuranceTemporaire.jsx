import LegacyRedirect from '../../components/LegacyRedirect';

function ListeSituationsAssuranceTemporaire() {
  return (
    <LegacyRedirect
      to="/articles"
      title="Tous nos articles sur l'assurance auto temporaire | AssuTempo"
      description="Cette adresse a changé : la liste des situations nécessitant une assurance temporaire se trouve désormais dans nos articles, classés par cas concret."
      eyebrow="SITUATIONS COURANTES"
      heading="Cette adresse a changé"
      body="Voiture immobilisée, sortie de fourrière, contrôle sans assurance, véhicule prêté... chaque situation a désormais son article dédié, réunis sur notre page Articles. Vous y êtes conduit dans un instant."
      cta="Voir tous les articles"
    />
  );
}

export default ListeSituationsAssuranceTemporaire;
