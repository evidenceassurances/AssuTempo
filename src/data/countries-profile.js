/* ─────────────────────────────────────────────────────────────────────────────
   countries-profile.js, couche de DIFFERENCIATION des 34 fiches pays.

   Pourquoi ce fichier existe
   ──────────────────────────
   Audit Search Console du 02/09/2026 : 29 fiches /carte/<slug> sur 34 etaient
   en "Detectee, actuellement non indexee". Le maillage interne a ete pose le
   02/09 (chaque fiche recoit 36 a 77 pages liantes, dont 33 fiches pays), donc
   le crawl n'est plus bride par l'absence de liens. Mesure faite sur le HTML
   prerendu avant ce fichier : 764 mots par fiche, dont seulement 26 % de
   contenu unique (shingles de 6 mots presents sur une seule des 34 pages).
   Autrement dit, les trois quarts du texte etaient identiques d'une fiche a
   l'autre. Une page quasi dupliquee est exactement ce que Google detecte,
   met en file, et n'explore jamais.

   Ce fichier ajoute par pays du contenu qui n'existe nulle part ailleurs sur
   le site : une fiche d'identite routiere factuelle, deux paragraphes propres
   au pays (usages reels de la temporaire, acces depuis la France) et deux
   questions frequentes supplementaires.

   Regles de sourcing (YMYL, section 8 de CLAUDE.md)
   ────────────────────────────────────────────────
   Ne sont retenus ici que des faits STABLES et verifies :
   - statut UE / hors UE, monnaie, sens de circulation : invariants connus.
     Bulgarie a l'euro depuis le 01/01/2026 (Banque de France, Parlement
     europeen), le lev a cesse d'avoir cours legal le 01/02/2026.
   - alcoolemie : seuils legaux, verifies par recherche web le 09/09/2026 et
     coherents avec le contenu deja publie sur les fiches.
   - peage : repris de la micro-info deja verifiee dans countries-content.js
     (INFO_CLE), completee pour les 5 pays qui n'en avaient pas.
   - urgence : 112 dans toute la zone couverte, 999 ou 112 au Royaume-Uni.

   Volontairement ABSENTS, car volatils ou contradictoires entre sources
   (regle CLAUDE.md : eviter les specificites volatiles) : montants d'amendes,
   prix de vignettes, limitations de vitesse (sources en desaccord sur la
   Bulgarie, la Tchequie et le Danemark), dates exactes d'obligation des pneus
   hiver. Quand une regle hivernale est certaine pour un pays, elle vit deja
   dans ses cartes de countries-content.js, pas ici.

   Les deux paragraphes de prose (usages, acces) sont commerciaux et
   geographiques, jamais juridiques : c'est ce qui les rend surs a publier et
   uniques a la fois.
───────────────────────────────────────────────────────────────────────────── */

export const PAYS_PROFIL = {

  allemagne: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,5 g/L, 0,0 g/L avant 21 ans ou moins de 2 ans de permis`,
      peage: `Autoroutes gratuites pour les voitures particulières`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour l'Allemagne`,
      texte: `L'Allemagne est le premier fournisseur de voitures d'occasion importées en France, et c'est ce qui amène le plus de conducteurs vers une formule courte : vous achetez à Cologne, Stuttgart ou Munich, le véhicule n'est plus couvert par le vendeur, et la carte grise française mettra des jours à arriver. Une temporaire d'un à quelques jours suffit à ramener la voiture. Les trajets professionnels vers la Ruhr et les week-ends frontaliers depuis l'Alsace ou la Moselle relèvent de la même logique : vous payez la durée réelle, pas un contrat annuel.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `Quatre portes principales : Strasbourg vers Karlsruhe, Forbach vers Sarrebruck, Lauterbourg vers le Bade, et le nord par la Belgique vers Aix-la-Chapelle. Paris rejoint Francfort en 570 km environ, Munich en 830 km. Aucune barrière de péage sur l'Autobahn, mais la vignette environnementale est contrôlée dans la plupart des centres urbains : elle se colle sur le pare-brise et n'a rien à voir avec l'assurance.`,
    },
    faqPlus: [
      {
        q: `J'achète une voiture en Allemagne, quelle durée choisir ?`,
        a: `Comptez la durée du rapatriement plus une marge. Munich ou Stuttgart vers Paris se fait dans la journée, mais un départ tardif, une panne ou une immatriculation qui traîne se règlent mieux avec 3 à 7 jours qu'avec 24 heures. Le contrat couvre la responsabilité civile dès le premier jour, en Allemagne comme sur le trajet de retour en France.`,
      },
      {
        q: `Les plaques allemandes de transit sont-elles assurées ?`,
        a: `Les plaques courtes durée délivrées en Allemagne, dont les plaques dites Kurzzeitkennzeichen, exigent une attestation d'assurance en responsabilité civile. Votre contrat AssuTempo et sa carte internationale d'assurance automobile constituent cette preuve de couverture pour circuler.`,
      },
    ],
  },

  andorre: {
    identite: {
      statut: `Hors Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,5 g/L`,
      peage: `Aucun péage`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour l'Andorre`,
      texte: `La principauté se traverse en une journée, et c'est précisément le profil qui rend le contrat annuel absurde. Descente d'achats depuis Toulouse ou Perpignan, séjour au ski à Grandvalira, véhicule prêté à un proche pour le week-end : quelques jours de couverture répondent au besoin. Attention à un détail que beaucoup découvrent à la frontière : l'Andorre n'est pas dans l'Union européenne, la douane est réelle et les quantités rapportées sont contrôlées.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `Une seule route française, la N20 par le Pas de la Case, via l'Ariège et le tunnel d'Envalira. Toulouse est à environ 190 km, Perpignan à 170 km par la route espagnole. L'itinéraire grimpe haut : au cœur de l'hiver, les conditions au col changent vite et l'équipement neige devient indispensable, même quand la vallée est dégagée.`,
    },
    faqPlus: [
      {
        q: `Faut-il une assurance particulière pour l'Andorre ?`,
        a: `Non, aucune formalité supplémentaire : l'Andorre fait partie des 34 pays couverts par votre carte internationale d'assurance automobile AssuTempo. La responsabilité civile obligatoire y est active dès le premier jour du contrat.`,
      },
      {
        q: `Peut-on traverser l'Espagne pour rejoindre l'Andorre ?`,
        a: `Oui, et c'est souvent l'itinéraire choisi depuis Perpignan par la Seu d'Urgell. L'Espagne comme l'Andorre figurent parmi les 34 pays couverts : le même contrat vaut sur toute la chaîne du trajet, sans démarche à la frontière.`,
      },
    ],
  },

  autriche: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,5 g/L, 0,1 g/L pour les permis de moins de 2 ans`,
      peage: `Vignette autoroutière obligatoire, plus péages spécifiques`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour l'Autriche`,
      texte: `L'Autriche est un pays de traversée autant qu'un pays de destination. On la franchit pour descendre vers l'Italie ou remonter vers la Bohême, on y monte pour une semaine de ski au Tyrol ou dans le Vorarlberg. Dans les deux cas la durée est connue à l'avance, ce qui est exactement le terrain de l'assurance temporaire. S'ajoute le cas du véhicule acheté en Autriche ou en Bavière voisine, qu'il faut ramener couvert avant l'immatriculation française.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `L'accès naturel passe par l'Allemagne : Strasbourg, puis Munich, puis le Tyrol par Kufstein. Le second itinéraire remonte l'Italie du Nord vers le Brenner, le troisième traverse la Suisse par Saint-Gall. Paris est à environ 1 250 km de Vienne, Lyon à 700 km d'Innsbruck. La vignette autoroutière se prend avant d'entrer sur le réseau, et certains tunnels alpins ainsi que des routes de col se paient en plus.`,
    },
    faqPlus: [
      {
        q: `La vignette autrichienne remplace-t-elle l'assurance ?`,
        a: `Non, ce sont deux choses distinctes. La vignette autrichienne est un droit de circulation sur le réseau rapide. L'assurance en responsabilité civile est une obligation légale séparée, couverte par votre contrat AssuTempo et attestée par la carte internationale d'assurance automobile.`,
      },
      {
        q: `Traverser l'Autriche vers l'Italie est-il couvert ?`,
        a: `Oui. L'Autriche et l'Italie figurent toutes deux parmi les 34 pays couverts, comme l'Allemagne et la Suisse sur la route d'accès. Un seul contrat suit le véhicule sur l'ensemble du trajet, sans déclaration de passage.`,
      },
    ],
  },

  belgique: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,5 g/L, 0,2 g/L pour les conducteurs professionnels`,
      peage: `Autoroutes gratuites, tunnel du Liefkenshoek payant`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Belgique`,
      texte: `La frontière belge est l'une des plus poreuses d'Europe pour les particuliers français : achat de véhicule, déménagement, travail transfrontalier depuis Lille ou Valenciennes, visite familiale. Le marché de l'occasion belge attire aussi, avec des véhicules souvent bien entretenus. Le point commun de ces situations est la durée courte et connue, où souscrire douze mois pour trois jours de route n'a pas de sens.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `Le franchissement le plus emprunté reste l'A1 puis l'A7 depuis Lille vers Tournai et Bruxelles, à environ 300 km de Paris. Plus à l'est, l'A4 rejoint la province de Luxembourg par Longwy. Le réseau autoroutier belge est gratuit et éclairé sur une grande partie de son tracé, mais Bruxelles, Anvers et Gand appliquent des zones de basses émissions avec enregistrement préalable du véhicule étranger.`,
    },
    faqPlus: [
      {
        q: `Faut-il enregistrer son véhicule pour entrer dans Bruxelles ou Anvers ?`,
        a: `Ces villes appliquent une zone de basses émissions et demandent un enregistrement du véhicule immatriculé à l'étranger avant la première circulation. Cette démarche est indépendante de l'assurance : votre couverture AssuTempo reste valable, mais elle ne dispense pas de l'enregistrement.`,
      },
      {
        q: `J'achète une voiture en Belgique, suis-je couvert pour rentrer ?`,
        a: `Oui, dès le premier jour du contrat. C'est l'usage le plus fréquent de la formule courte sur cette frontière : le vendeur cesse de couvrir le véhicule à la remise des clés, et la temporaire prend le relais le temps du retour et des démarches d'immatriculation.`,
      },
    ],
  },

  'bosnie-herzegovine': {
    identite: {
      statut: `Hors Union européenne`,
      monnaie: `Mark convertible`,
      conduite: `À droite`,
      alcool: `0,3 g/L`,
      peage: `Péage sur l'autoroute A1`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Bosnie-Herzégovine`,
      texte: `Deux profils dominent ici. Le voyage, d'abord : Mostar et Sarajevo s'inscrivent presque toujours dans un circuit balkanique plus large, entamé en Croatie ou en Slovénie. Le lien familial ensuite, avec une diaspora nombreuse en France qui rentre au pays en voiture l'été. Dans les deux cas, le véhicule sort de l'Union européenne, et la carte internationale d'assurance automobile cesse d'être une formalité de confort pour devenir le document que l'on présente.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `L'itinéraire classique passe par l'Italie du Nord, la Slovénie puis la Croatie, avant d'entrer par Bihać au nord ou par la vallée de la Neretva depuis la côte dalmate. Comptez près de 1 800 km depuis Lyon. Le réseau autoroutier reste limité à l'A1 autour de Sarajevo et Zenica : hors de cet axe, la moyenne horaire chute nettement, et il faut prévoir large sur les routes de montagne.`,
    },
    faqPlus: [
      {
        q: `La carte verte est-elle exigée à l'entrée en Bosnie-Herzégovine ?`,
        a: `Le pays est hors Union européenne et la carte internationale d'assurance automobile, dite carte verte, est le document qui prouve votre couverture au poste frontière. Elle est délivrée avec votre contrat AssuTempo, sans démarche supplémentaire.`,
      },
      {
        q: `Peut-on enchaîner Croatie et Bosnie avec le même contrat ?`,
        a: `Oui. Les deux pays font partie des 34 pays couverts, tout comme la Slovénie et l'Italie sur la route d'accès. Le corridor de Neum, qui coupe la côte croate sur quelques kilomètres de territoire bosnien, ne pose donc aucun problème de couverture.`,
      },
    ],
  },

  bulgarie: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro depuis le 1er janvier 2026`,
      conduite: `À droite`,
      alcool: `0,5 g/L`,
      peage: `E-vignette obligatoire sur le réseau national`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Bulgarie`,
      texte: `La Bulgarie se rejoint rarement pour un aller-retour rapide : c'est un long trajet, souvent un convoyage de véhicule, un déménagement ou une visite familiale de plusieurs semaines. La formule courte y trouve pourtant sa place, notamment pour les véhicules achetés en Europe centrale et ramenés vers la France, ou pour un conducteur supplémentaire ajouté le temps du retour. Depuis janvier 2026, le pays est passé à l'euro, ce qui simplifie carburant et péages en cours de route.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `Deux grandes routes. La route du nord traverse l'Allemagne, l'Autriche, la Hongrie et la Roumanie, environ 2 300 km depuis Paris. La route du sud passe par l'Italie, la Slovénie, la Croatie et la Serbie. L'e-vignette bulgare s'achète en ligne ou aux stations frontalières et se lie à la plaque d'immatriculation : aucun autocollant à poser sur le pare-brise.`,
    },
    faqPlus: [
      {
        q: `Quelle monnaie prévoir en Bulgarie en 2026 ?`,
        a: `L'euro. La Bulgarie l'a adopté le 1er janvier 2026 et le lev a cessé d'avoir cours légal le 1er février 2026. Les paiements sur le réseau routier et dans les stations se font donc dans la même monnaie qu'en France.`,
      },
      {
        q: `Traverser la Serbie pour rejoindre la Bulgarie pose-t-il un problème ?`,
        a: `La Serbie ne fait pas partie des 34 pays de la couverture standard AssuTempo. Si votre itinéraire la traverse, préférez la route par la Roumanie, entièrement couverte, ou demandez un devis sur la page des destinations hors Europe avant de partir.`,
      },
    ],
  },

  chypre: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À gauche`,
      alcool: `0,5 g/L`,
      peage: `Aucun péage`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour Chypre`,
      texte: `Chypre est une île, donc on n'y arrive pas au volant de sa voiture française : le besoin de couverture courte concerne ici le véhicule d'un proche que l'on conduit sur place, le véhicule d'un résident prêté quelques jours, ou un véhicule importé puis immatriculé. Ajoutez la particularité qui surprend le plus les conducteurs continentaux : on roule à gauche, héritage britannique conservé après l'indépendance.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `Aucune liaison routière : l'accès se fait par avion vers Larnaca ou Paphos, ou par ferry depuis le Pirée pour un véhicule accompagné. Sur place, le réseau est de bonne qualité et entièrement gratuit, mais la conduite à gauche impose une vigilance particulière aux ronds-points et lors des premiers kilomètres après la sortie de l'aéroport.`,
    },
    faqPlus: [
      {
        q: `On roule à gauche à Chypre, cela change-t-il l'assurance ?`,
        a: `Non. Le sens de circulation ne modifie ni l'étendue de la responsabilité civile ni la validité du contrat. Chypre fait partie des 34 pays couverts, et votre carte internationale d'assurance automobile y vaut comme ailleurs.`,
      },
      {
        q: `Le nord de l'île est-il couvert ?`,
        a: `La couverture vaut pour la République de Chypre, membre de l'Union européenne. La partie nord relève d'une administration distincte, où une assurance locale est exigée au passage : renseignez-vous au point de contrôle avant de traverser.`,
      },
    ],
  },

  croatie: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,5 g/L, 0,0 g/L de 18 à 24 ans et pour les professionnels`,
      peage: `Péage au passage sur les autoroutes`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Croatie`,
      texte: `La Croatie est une destination d'été très saisonnière, et la saisonnalité est l'argument même de la formule courte : trois semaines de côte dalmate ne justifient pas douze mois de contrat. S'y ajoutent les véhicules de location entre particuliers, les seconds conducteurs ajoutés pour le trajet de descente, et les camping-cars ou utilitaires sortis du garage uniquement pour les vacances.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `L'itinéraire dominant descend par l'Italie du Nord, franchit la Slovénie et entre par Rijeka, environ 1 200 km depuis Lyon. La variante alpine passe par la Suisse et l'Autriche. Les autoroutes croates se paient au passage, avec un ticket pris à l'entrée : prévoyez du liquide ou une carte, les files s'allongent fortement les samedis de juillet et d'août.`,
    },
    faqPlus: [
      {
        q: `Le corridor de Neum coupe la côte croate, faut-il une assurance en plus ?`,
        a: `Non. Ces quelques kilomètres de territoire bosnien traversent un pays qui fait lui aussi partie des 34 pays couverts. Le même contrat AssuTempo reste valable sans démarche particulière au passage.`,
      },
      {
        q: `Combien de jours prévoir pour un séjour en Croatie ?`,
        a: `Comptez le séjour sur place plus les deux journées de route, aller et retour. La souscription se fait de 1 à 90 jours : une descente de deux semaines se couvre confortablement avec 18 à 20 jours plutôt qu'un calcul au plus juste.`,
      },
    ],
  },

  danemark: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Couronne danoise`,
      conduite: `À droite`,
      alcool: `0,5 g/L, 0,2 g/L pendant les 3 premières années de permis`,
      peage: `Réseau gratuit, ponts du Grand Belt et de l'Öresund payants`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour le Danemark`,
      texte: `Le Danemark est presque toujours une étape plutôt qu'une fin de parcours : on le traverse pour rejoindre la Suède, la Norvège ou le nord de l'Allemagne. Cette logique de passage colle à une couverture calée sur la durée du voyage. L'autre usage régulier est l'achat de véhicule dans le nord de l'Europe, où la fiscalité automobile danoise pousse certains particuliers à revendre à l'étranger.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `Une seule logique d'accès terrestre : remonter par la Belgique et les Pays-Bas, puis l'Allemagne jusqu'au Jutland par Flensbourg. Paris est à environ 1 200 km de Copenhague. Le réseau danois lui-même est gratuit, mais deux ouvrages se paient et pèsent dans le budget : le pont du Grand Belt entre Fionie et Seeland, et le pont de l'Öresund vers la Suède.`,
    },
    faqPlus: [
      {
        q: `Les ponts danois sont-ils compris dans l'assurance ?`,
        a: `Non, ce sont des péages d'ouvrage, payés au passage et indépendants de toute assurance. Votre contrat AssuTempo couvre la responsabilité civile obligatoire au Danemark, mais le franchissement du Grand Belt ou de l'Öresund reste à votre charge.`,
      },
      {
        q: `Peut-on enchaîner Danemark et Suède avec le même contrat ?`,
        a: `Oui, et c'est l'enchaînement le plus courant par le pont de l'Öresund. Les deux pays figurent parmi les 34 pays couverts, comme l'Allemagne et les Pays-Bas sur la route d'accès.`,
      },
    ],
  },


  espagne: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,5 g/L, 0,3 g/L pour les permis de moins de 2 ans`,
      peage: `Péage sur une partie du réseau autoroutier`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour l'Espagne`,
      texte: `C'est la destination où la formule courte se justifie le plus mécaniquement : des millions de trajets français vers la Catalogne, l'Andalousie ou la côte valencienne, concentrés sur quelques semaines d'été. S'y ajoutent deux usages moins visibles mais constants, le véhicule acheté en Espagne et ramené en France, et le second conducteur ajouté pour partager un long trajet de descente sans toucher au contrat annuel du propriétaire.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `Deux portes classiques : Le Perthus sur la façade méditerranéenne, Biriatou côté atlantique, plus les passages pyrénéens du Somport et du Puymorens. Paris est à environ 1 050 km de Barcelone, Bordeaux à 250 km de Saint-Sébastien. Une partie des autoroutes espagnoles est repassée en gratuité ces dernières années, mais des tronçons restent payants : vérifiez les panneaux AP en entrant sur le réseau.`,
    },
    faqPlus: [
      {
        q: `J'achète un véhicule en Espagne, la couverture démarre quand ?`,
        a: `Dès le premier jour du contrat, et vous choisissez ce jour au moment de la souscription. Vous pouvez donc souscrire la veille de la remise des clés pour que le véhicule soit couvert au moment exact où le vendeur cesse de l'assurer.`,
      },
      {
        q: `Les zones à faibles émissions espagnoles concernent-elles les plaques françaises ?`,
        a: `Oui, plusieurs grandes villes dont Madrid et Barcelone appliquent des restrictions de circulation aux véhicules étrangers, avec enregistrement préalable dans certains cas. C'est une réglementation de circulation, distincte de l'assurance, qui ne remet pas en cause la validité de votre contrat.`,
      },
    ],
  },

  estonie: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,2 g/L`,
      peage: `Aucun péage pour les voitures particulières`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour l'Estonie`,
      texte: `L'Estonie apparaît surtout dans des circuits baltes, enchaînée avec la Lettonie et la Lituanie sur une à deux semaines. C'est un format de voyage borné, où l'on connaît la date de retour avant de partir. Second usage, plus discret : les véhicules d'occasion d'Europe du Nord convoyés vers l'ouest, dont le trajet de rapatriement demande une couverture courte le temps de rejoindre le pays d'immatriculation.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `La route terrestre remonte par l'Allemagne, la Pologne puis la Via Baltica à travers la Lituanie et la Lettonie, soit près de 2 400 km depuis Paris jusqu'à Tallinn. L'alternative maritime consiste à embarquer depuis l'Allemagne du Nord vers la Finlande, puis à franchir le golfe par le ferry Helsinki-Tallinn. Le réseau routier est gratuit, mais les distances entre stations s'allongent hors des grands axes.`,
    },
    faqPlus: [
      {
        q: `Le seuil d'alcoolémie estonien est-il plus strict qu'en France ?`,
        a: `Oui, il est fixé à 0,2 g/L contre 0,5 g/L en France, ce qui revient en pratique à ne pas boire du tout avant de conduire. Un contrôle positif engage votre responsabilité et peut avoir des conséquences sur la prise en charge d'un sinistre.`,
      },
      {
        q: `Un circuit dans les trois pays baltes est-il couvert par un seul contrat ?`,
        a: `Oui. Estonie, Lettonie et Lituanie font partie des 34 pays couverts, tout comme la Pologne et l'Allemagne sur la route d'accès. Un contrat unique suit le véhicule sur l'ensemble du circuit.`,
      },
    ],
  },

  finlande: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,5 g/L`,
      peage: `Aucun péage`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Finlande`,
      texte: `Deux saisons, deux usages. L'été, le road trip vers les lacs et la Laponie, sur deux à trois semaines. L'hiver, les séjours au nord du cercle polaire, où le véhicule est le plus souvent loué ou prêté sur place. Dans les deux cas la durée est bornée, et le froid extrême rend la question de la couverture plus concrète qu'ailleurs : une sortie de route sur verglas se règle mieux avec un contrat en cours qu'avec une attestation périmée.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `Il n'existe pas de route directe : on remonte par l'Allemagne et le Danemark, puis on traverse la Suède avant de contourner le golfe de Botnie, ou l'on embarque sur un ferry vers Helsinki depuis l'Allemagne du Nord. Comptez plus de 2 500 km depuis Paris. Le réseau finlandais est gratuit et peu chargé, mais les nuits sont longues en hiver et la faune traverse : les collisions avec les élans et les rennes sont un risque réel.`,
    },
    faqPlus: [
      {
        q: `Que faire en cas de collision avec un renne ou un élan ?`,
        a: `L'accident doit être signalé aux autorités, y compris si l'animal s'enfuit. C'est une obligation locale et non une formalité d'assurance, mais le constat facilite ensuite toute déclaration. Votre responsabilité civile reste couverte pendant toute la durée de votre contrat AssuTempo.`,
      },
      {
        q: `Peut-on rejoindre la Finlande par la Suède avec le même contrat ?`,
        a: `Oui. Suède, Danemark et Allemagne figurent parmi les 34 pays couverts, comme la Finlande elle-même. Le contrat suit le véhicule sur tout le trajet, y compris pendant les traversées en ferry.`,
      },
    ],
  },

  france: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,5 g/L, 0,2 g/L pour les permis probatoires`,
      peage: `Péage sur la majeure partie du réseau autoroutier`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire en France`,
      texte: `C'est le marché d'origine d'AssuTempo, et les situations y sont très concrètes : véhicule acheté entre particuliers un samedi, dont il faut rentrer le jour même ; voiture prêtée à un enfant ou à un ami pour un week-end ; véhicule immobilisé le temps d'obtenir sa carte grise ; conducteur résilié qui doit continuer à rouler en attendant une solution annuelle. Ce dernier profil est celui qui revient le plus souvent chez nous.`,
    },
    acces: {
      titre: `Sur le territoire`,
      texte: `La France est le point de départ de la quasi-totalité des trajets couverts par nos contrats, et la plaque tournante du réseau européen : six frontières terrestres, un tunnel sous la Manche, des liaisons ferry vers le Royaume-Uni, l'Irlande et la Corse. Le réseau autoroutier est majoritairement concédé et payant, et les zones à faibles émissions des grandes agglomérations demandent une vignette Crit'Air apposée sur le pare-brise.`,
    },
    faqPlus: [
      {
        q: `Puis-je assurer un véhicule si j'ai été résilié par mon assureur ?`,
        a: `C'est l'un des motifs les plus fréquents de souscription. La formule temporaire ne remplace pas un contrat annuel sur la durée, mais elle vous permet de rester couvert et donc en règle pendant que vous cherchez une solution durable, sans rupture de garantie.`,
      },
      {
        q: `Puis-je rouler en France en attendant ma carte grise définitive ?`,
        a: `Oui, à condition d'être assuré et de disposer d'un titre provisoire en cours de validité. L'assurance et le certificat d'immatriculation sont deux obligations distinctes : la couverture AssuTempo répond à la première, et notre page carte grise explique la seconde.`,
      },
    ],
  },

  grece: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,5 g/L, 0,2 g/L pour les jeunes permis et les motards`,
      peage: `Péage au passage sur les autoroutes`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Grèce`,
      texte: `Le trajet routier vers la Grèce est long, ce qui en fait un voyage préparé, daté, et donc parfaitement adapté à une couverture calée sur la durée réelle. Beaucoup de conducteurs franchissent l'Adriatique en ferry depuis l'Italie, ce qui raccourcit la route sans changer le besoin. Autre cas récurrent, le véhicule d'un proche conduit sur place pendant l'été, notamment dans les îles où la voiture familiale change souvent de mains.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `La voie maritime est la plus empruntée : descente jusqu'à Ancône, Bari ou Brindisi, puis ferry vers Igoumenitsa ou Patras. La voie terrestre traverse la Slovénie, la Croatie, puis la Macédoine du Nord ou la Bulgarie. Comptez 2 000 km environ jusqu'à Athènes par l'Italie. Les autoroutes grecques se paient au passage, à des barrières régulières sur l'axe Athènes-Thessalonique.`,
    },
    faqPlus: [
      {
        q: `Le ferry depuis l'Italie change-t-il quelque chose à la couverture ?`,
        a: `Non. L'Italie et la Grèce font partie des 34 pays couverts, et la traversée n'interrompt pas le contrat. Assurez-vous simplement que la durée souscrite englobe l'attente à l'embarquement et la traversée elle-même, qui prend souvent une nuit complète.`,
      },
      {
        q: `Attention aux pays traversés par la route terrestre ?`,
        a: `Oui, c'est le point à vérifier. La Serbie et la Macédoine du Nord ne font pas partie de la couverture standard des 34 pays. Si votre itinéraire les emprunte, passez par l'option ferry depuis l'Italie ou demandez un devis pour ces destinations avant le départ.`,
      },
    ],
  },

  hongrie: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Forint`,
      conduite: `À droite`,
      alcool: `0,0 g/L, tolérance zéro`,
      peage: `E-vignette liée à la plaque d'immatriculation`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Hongrie`,
      texte: `La Hongrie est un carrefour : on la traverse pour descendre vers les Balkans, remonter vers la Pologne ou rejoindre la Roumanie. Ce rôle de couloir explique une bonne partie des souscriptions courtes. À cela s'ajoutent les convoyages de véhicules d'occasion d'Europe centrale vers la France, et les séjours à Budapest ou au lac Balaton, dont la durée est arrêtée à l'avance.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `L'itinéraire habituel remonte l'Allemagne du Sud jusqu'à Munich, franchit l'Autriche par Vienne et entre par Hegyeshalom. Paris est à environ 1 500 km de Budapest. L'e-vignette hongroise s'achète en ligne ou en station et se rattache à la plaque : aucun justificatif papier à conserver sur le pare-brise, mais un contrôle automatisé par caméra sur tout le réseau rapide.`,
    },
    faqPlus: [
      {
        q: `La tolérance zéro hongroise s'applique-t-elle aux conducteurs étrangers ?`,
        a: `Oui, sans distinction de nationalité ni de pays d'immatriculation. Le seuil est de 0,0 g/L pour tous : aucune consommation d'alcool n'est admise avant de prendre le volant, contrairement au seuil de 0,5 g/L en vigueur en France.`,
      },
      {
        q: `L'e-vignette hongroise remplace-t-elle l'attestation d'assurance ?`,
        a: `Non. La vignette est un droit de circulation sur le réseau rapide, l'assurance en responsabilité civile est une obligation distincte. Les deux sont exigibles en cas de contrôle, et seule la seconde est couverte par votre contrat AssuTempo.`,
      },
    ],
  },

  irlande: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À gauche`,
      alcool: `0,5 g/L, 0,2 g/L pour les jeunes permis et les professionnels`,
      peage: `Péages sur plusieurs axes, M50 sans barrière`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour l'Irlande`,
      texte: `L'Irlande impose deux ruptures d'habitude au conducteur français : la conduite à gauche et l'arrivée par ferry. Les séjours y sont donc préparés, bornés dans le temps, et la formule courte suit naturellement la durée du voyage. Un autre cas revient régulièrement, celui du véhicule acheté en Irlande ou en Irlande du Nord et rapatrié vers le continent, où la couverture doit tenir sur le trajet et les traversées.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `Deux options. Le ferry direct depuis Cherbourg ou Roscoff vers Dublin et Rosslare, entre 14 et 20 heures de traversée selon la ligne. Ou la route par le Royaume-Uni, avec un second ferry en mer d'Irlande. Sur place, la M50 autour de Dublin se paie sans barrière, par lecture de plaque, avec un règlement à effectuer avant la fin de la journée suivante.`,
    },
    faqPlus: [
      {
        q: `Le péage M50 de Dublin se paie comment avec une plaque française ?`,
        a: `Le portique lit la plaque et le règlement se fait ensuite en ligne ou dans certains commerces, avant la fin de la journée suivante. C'est une redevance de circulation, sans rapport avec l'assurance, mais son oubli déclenche des pénalités adressées au titulaire du véhicule.`,
      },
      {
        q: `Passer d'Irlande en Irlande du Nord est-il couvert ?`,
        a: `Oui. L'Irlande et le Royaume-Uni, dont dépend l'Irlande du Nord, font tous deux partie des 34 pays couverts. La frontière terrestre entre les deux se franchit sans contrôle, et votre contrat reste valable de part et d'autre.`,
      },
    ],
  },

  islande: {
    identite: {
      statut: `Hors Union européenne, Espace économique européen`,
      monnaie: `Couronne islandaise`,
      conduite: `À droite`,
      alcool: `0,2 g/L`,
      peage: `Réseau gratuit, tunnel de Vaðlaheiði payant`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour l'Islande`,
      texte: `Presque personne n'arrive en Islande au volant de sa propre voiture : le besoin porte ici sur un véhicule utilisé sur place, prêté, ou acheminé par le ferry depuis le Danemark. Le voyage type dure une à trois semaines, le temps d'un tour de l'île. Les conditions y sont exigeantes : vent violent, pistes de l'intérieur, ponts à voie unique, et une météo qui change en quelques minutes.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `Une seule voie pour un véhicule accompagné : le ferry Smyril Line depuis Hirtshals au Danemark, via les îles Féroé, environ deux jours de mer. Sinon, l'avion et un véhicule pris sur place. La route circulaire numéro 1 fait le tour de l'île sur près de 1 330 km ; les pistes F de l'intérieur sont réservées aux véhicules tout-terrain et interdites au reste.`,
    },
    faqPlus: [
      {
        q: `Les pistes F de l'intérieur sont-elles couvertes ?`,
        a: `La responsabilité civile obligatoire reste acquise en Islande pour la durée du contrat. En revanche, ces pistes sont légalement réservées aux véhicules adaptés, et emprunter une voie interdite avec un véhicule non autorisé vous expose à une sanction locale et complique tout dossier de sinistre.`,
      },
      {
        q: `L'Islande fait-elle partie des 34 pays couverts ?`,
        a: `Oui, bien qu'elle soit hors Union européenne. Elle appartient à l'Espace économique européen et figure dans la liste des 34 pays de votre carte internationale d'assurance automobile AssuTempo.`,
      },
    ],
  },

  italie: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,5 g/L, 0,0 g/L pour les permis de moins de 3 ans`,
      peage: `Péage au passage sur les autoroutes`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour l'Italie`,
      texte: `L'Italie combine trois besoins distincts. Les vacances, avec des séjours en Toscane, sur les lacs ou en Sicile dont les dates sont fixées longtemps à l'avance. L'achat de véhicule, notamment de voitures anciennes et de collection dont le marché italien est l'un des plus fournis d'Europe. Et le transit vers la Slovénie, la Croatie ou la Grèce par les ports de l'Adriatique, où le passage se compte en jours.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `Trois portes principales : le tunnel du Mont-Blanc depuis Chamonix, le tunnel du Fréjus depuis Modane, et la côte par Vintimille. Lyon est à environ 470 km de Turin, Paris à 1 100 km de Rome. Les autoroutes se paient au ticket, retiré à l'entrée et rendu à la sortie. Les centres historiques appliquent des zones à trafic limité, les ZTL, surveillées par caméras et sanctionnées automatiquement.`,
    },
    faqPlus: [
      {
        q: `Comment éviter une amende de ZTL en Italie ?`,
        a: `Les zones à trafic limité des centres historiques sont contrôlées par caméra, et l'amende arrive plusieurs mois plus tard à l'adresse du titulaire. Repérez les panneaux ZTL avant d'entrer dans une vieille ville et stationnez à l'extérieur : c'est une règle de circulation, indépendante de votre couverture d'assurance.`,
      },
      {
        q: `J'achète une voiture de collection en Italie, la temporaire convient-elle ?`,
        a: `C'est un usage classique de la formule. Elle couvre la responsabilité civile dès le premier jour, le temps du rapatriement et des démarches d'immatriculation en France, sans engager un contrat annuel sur un véhicule que vous n'avez pas encore immatriculé.`,
      },
    ],
  },

  lettonie: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,5 g/L, 0,2 g/L pour les permis de moins de 2 ans`,
      peage: `Aucun péage pour les voitures particulières`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Lettonie`,
      texte: `La Lettonie se visite rarement seule : elle occupe le centre du circuit balte, entre Vilnius et Tallinn, sur des voyages d'une à deux semaines. Riga concentre l'essentiel des séjours. Le second usage tient au convoyage : les véhicules d'occasion circulent beaucoup dans cette région, et un rapatriement vers l'ouest demande une couverture qui tienne le temps de la route, pas douze mois.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `On remonte par l'Allemagne et la Pologne, puis la Via Baltica traverse la Lituanie avant d'atteindre Riga, soit environ 2 100 km depuis Paris. Le réseau letton est gratuit pour les voitures particulières. Hors des grands axes, beaucoup de routes secondaires restent en gravier : la vitesse chute et les projections de pierres sur le pare-brise sont fréquentes.`,
    },
    faqPlus: [
      {
        q: `Les routes en gravier posent-elles un problème de couverture ?`,
        a: `Non, la responsabilité civile obligatoire vaut sur l'ensemble du réseau letton, revêtu ou non. Ces routes demandent simplement de lever le pied et d'augmenter les distances : les projections de gravillons sont la première cause de dégâts signalés par les conducteurs étrangers.`,
      },
      {
        q: `Un seul contrat suffit-il pour les trois pays baltes ?`,
        a: `Oui. Lettonie, Lituanie et Estonie figurent parmi les 34 pays couverts, comme la Pologne et l'Allemagne sur la route d'accès. Aucune démarche n'est à faire aux frontières intérieures de l'Union.`,
      },
    ],
  },

  lituanie: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,4 g/L, 0,0 g/L pour les jeunes permis et les professionnels`,
      peage: `Aucun péage pour les voitures particulières`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Lituanie`,
      texte: `La Lituanie est la porte d'entrée des pays baltes quand on vient par la route, et un carrefour logistique majeur entre la Pologne et la Scandinavie. D'où deux usages : le circuit touristique qui démarre à Vilnius avant de remonter vers Riga, et le convoyage de véhicules, très fréquent sur ce corridor. Dans les deux cas, la durée du besoin se compte en jours.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `L'itinéraire passe par l'Allemagne puis la Pologne, et emprunte la Via Baltica à partir de Suwałki. Paris est à environ 1 900 km de Vilnius. Le réseau lituanien est gratuit pour les voitures. Le couloir de Suwałki, étroite bande entre la Biélorussie et l'enclave de Kaliningrad, est le seul passage terrestre depuis l'Union : mieux vaut le franchir de jour.`,
    },
    faqPlus: [
      {
        q: `Le seuil d'alcoolémie lituanien est-il différent du français ?`,
        a: `Oui, il est fixé à 0,4 g/L contre 0,5 g/L en France, et descend à 0,0 g/L pour les jeunes permis, les motards et les conducteurs professionnels. En pratique, la marge est trop faible pour prendre un risque avant de conduire.`,
      },
      {
        q: `Faut-il éviter de traverser la Biélorussie ou Kaliningrad ?`,
        a: `Ces territoires ne font pas partie des 34 pays couverts, et une assurance frontière locale y serait exigée. L'itinéraire par la Pologne et le couloir de Suwałki reste entièrement à l'intérieur de la zone couverte par votre contrat.`,
      },
    ],
  },

  luxembourg: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,5 g/L, 0,2 g/L pour les jeunes permis et les professionnels`,
      peage: `Aucun péage`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour le Luxembourg`,
      texte: `Des dizaines de milliers de frontaliers lorrains traversent chaque jour, et le Grand-Duché sert aussi de point de passage vers la Belgique et l'Allemagne. Cela crée un besoin très particulier : des trajets fréquents mais des situations ponctuelles, comme un véhicule de remplacement, une voiture prêtée à un collègue, ou un achat effectué sur place. Le carburant moins cher y attire aussi des trajets courts et répétés depuis Thionville ou Longwy.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `L'A31 depuis Metz et Thionville mène directement à Luxembourg-ville, à moins de 60 km de la frontière. Paris est à environ 370 km. Le réseau routier luxembourgeois est entièrement gratuit, y compris les autoroutes, et les transports publics du pays sont gratuits eux aussi, ce qui change la donne pour un séjour en ville sans véhicule.`,
    },
    faqPlus: [
      {
        q: `Un trajet frontalier quotidien justifie-t-il une temporaire ?`,
        a: `Sur la durée, non : un usage quotidien permanent relève d'un contrat annuel. La formule courte répond aux situations ponctuelles, comme un véhicule de remplacement pendant une immobilisation, un prêt de quelques jours ou un achat à rapatrier.`,
      },
      {
        q: `Le Luxembourg est-il couvert sans démarche particulière ?`,
        a: `Oui, il fait partie des 34 pays couverts par la carte internationale d'assurance automobile AssuTempo, avec la responsabilité civile obligatoire active dès le premier jour du contrat.`,
      },
    ],
  },

  malte: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À gauche`,
      alcool: `0,5 g/L, 0,2 g/L pour les jeunes permis et véhicules commerciaux`,
      peage: `Aucun péage`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour Malte`,
      texte: `Sur un archipel de moins de 30 km de long, on n'arrive pas avec sa voiture française. Le besoin porte sur un véhicule utilisé sur place : celui d'un proche, celui d'un résident, ou un véhicule importé en attente d'immatriculation. Deux particularités marquent les conducteurs continentaux : la conduite à gauche, héritée de la période britannique, et une densité de circulation parmi les plus fortes d'Europe rapportée à la surface.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `Pas de liaison routière. Un véhicule accompagné embarque en ferry depuis Pozzallo ou Catane, en Sicile, après avoir descendu l'Italie. Sinon, l'avion vers La Valette. Sur place, les distances sont minuscules, mais les rues des villages sont étroites et le stationnement dans les centres relève du sport : beaucoup de visiteurs finissent par laisser le véhicule et prendre le bus.`,
    },
    faqPlus: [
      {
        q: `Conduire à gauche à Malte change-t-il la couverture ?`,
        a: `Non. Le sens de circulation n'a aucun effet sur la validité du contrat ni sur l'étendue de la responsabilité civile. Malte figure parmi les 34 pays couverts par votre carte internationale d'assurance automobile.`,
      },
      {
        q: `Peut-on rejoindre Malte via la Sicile avec le même contrat ?`,
        a: `Oui. L'Italie et Malte font toutes deux partie des 34 pays couverts, et la traversée en ferry n'interrompt pas la couverture. Prévoyez simplement une durée qui englobe l'attente au port et la traversée.`,
      },
    ],
  },

  montenegro: {
    identite: {
      statut: `Hors Union européenne`,
      monnaie: `Euro, adopté unilatéralement`,
      conduite: `À droite`,
      alcool: `0,3 g/L`,
      peage: `Tunnel de Sozina payant, réseau gratuit par ailleurs`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour le Monténégro`,
      texte: `Le Monténégro se glisse presque toujours dans un circuit adriatique, après la Croatie et souvent avant l'Albanie. La durée du passage est courte, quelques jours pour les Bouches de Kotor et le littoral, ce qui correspond exactement à une formule calée sur le besoin. Point à ne pas manquer : le pays est hors Union européenne, et la carte internationale d'assurance automobile devient le document que l'on présente au poste frontière.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `On descend par l'Italie du Nord, la Slovénie et la Croatie, puis l'on entre par Herceg Novi sur la côte, environ 1 900 km depuis Lyon. La route littorale est spectaculaire mais lente, très sinueuse au-dessus de Kotor. Le tunnel de Sozina, sur l'axe Podgorica-littoral, est payant, tout comme le ferry qui coupe la baie de Kotor et évite un long contournement.`,
    },
    faqPlus: [
      {
        q: `Quelle monnaie utilise-t-on au Monténégro ?`,
        a: `L'euro, adopté unilatéralement bien que le pays ne soit ni membre de l'Union européenne ni de la zone euro. Vous n'avez donc pas de change à prévoir, mais les contrôles douaniers à l'entrée sont bien réels.`,
      },
      {
        q: `Faut-il présenter la carte verte à la frontière monténégrine ?`,
        a: `Le Monténégro étant hors Union européenne, la carte internationale d'assurance automobile est le justificatif de couverture attendu au passage. Elle est délivrée avec votre contrat AssuTempo, immédiatement et sans démarche supplémentaire.`,
      },
    ],
  },

  norvege: {
    identite: {
      statut: `Hors Union européenne, Espace économique européen`,
      monnaie: `Couronne norvégienne`,
      conduite: `À droite`,
      alcool: `0,2 g/L`,
      peage: `Péages AutoPASS automatiques, par lecture de plaque`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Norvège`,
      texte: `Le road trip norvégien est un voyage long mais borné : deux à trois semaines pour remonter les fjords, parfois jusqu'au cap Nord. Cette durée fixe est le terrain naturel de la formule courte. S'y ajoute le second conducteur ajouté pour partager 4 000 km de route, et le véhicule de loisir sorti uniquement pour l'été, dont un contrat annuel couvrirait onze mois de garage.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `On remonte par la Belgique, l'Allemagne et le Danemark, puis on rejoint Oslo par la Suède ou par le ferry depuis Hirtshals. Comptez environ 1 800 km depuis Paris jusqu'à Oslo, et bien davantage vers le nord. Les péages norvégiens fonctionnent sans barrière, par lecture de plaque, avec une facturation adressée ensuite au titulaire du véhicule étranger.`,
    },
    faqPlus: [
      {
        q: `Comment se paient les péages norvégiens avec une plaque française ?`,
        a: `Le système AutoPASS lit la plaque au passage et adresse une facture au titulaire du véhicule, parfois plusieurs semaines plus tard. Aucun arrêt n'est nécessaire sur la route. C'est une redevance de circulation, sans lien avec votre contrat d'assurance.`,
      },
      {
        q: `La Norvège est-elle couverte alors qu'elle est hors Union européenne ?`,
        a: `Oui. Elle appartient à l'Espace économique européen et figure parmi les 34 pays couverts par votre carte internationale d'assurance automobile AssuTempo.`,
      },
    ],
  },

  'pays-bas': {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,5 g/L, 0,2 g/L pour les permis de moins de 5 ans`,
      peage: `Autoroutes gratuites, quelques tunnels payants`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour les Pays-Bas`,
      texte: `Le pays est proche, très accessible depuis le nord de la France, et son marché de l'occasion attire les acheteurs français, en particulier sur les véhicules récents et bien entretenus. Vient ensuite le tourisme de court séjour, Amsterdam et les champs de tulipes au printemps, souvent trois ou quatre jours. Enfin, les Pays-Bas servent de couloir vers l'Allemagne du Nord et la Scandinavie.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `L'A1 puis la Belgique par Anvers mènent à Rotterdam et Amsterdam, environ 500 km depuis Paris. Le réseau autoroutier néerlandais est gratuit, à l'exception du tunnel de l'Escaut occidental et du Kiltunnel. Les villes appliquent des zones environnementales et le stationnement en centre-ville figure parmi les plus chers d'Europe : les parkings relais en périphérie sont souvent le meilleur calcul.`,
    },
    faqPlus: [
      {
        q: `J'achète un véhicule aux Pays-Bas, la couverture vaut-elle pour le retour ?`,
        a: `Oui. La responsabilité civile est active dès le premier jour du contrat, aux Pays-Bas comme en Belgique et en France sur le trajet de retour, puisque ces trois pays font partie des 34 pays couverts.`,
      },
      {
        q: `Les Pays-Bas sont-ils un pays à péage ?`,
        a: `Presque pas : les autoroutes sont gratuites pour les voitures particulières. Seuls deux tunnels, celui de l'Escaut occidental et le Kiltunnel, se paient au passage. Il n'y a ni vignette ni abonnement à prévoir avant d'entrer dans le pays.`,
      },
    ],
  },

  pologne: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Zloty`,
      conduite: `À droite`,
      alcool: `0,2 g/L`,
      peage: `Péage sur les autoroutes concédées, télépéage e-TOLL sur le reste`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Pologne`,
      texte: `La Pologne est l'un des principaux réservoirs de véhicules d'occasion d'Europe, et le convoyage vers la France est un motif de souscription régulier : le véhicule change de main, le vendeur cesse de l'assurer, et il faut 1 500 km pour rentrer. À cela s'ajoutent les liens familiaux d'une diaspora nombreuse, avec des allers-retours estivaux, et le rôle de couloir vers les pays baltes.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `L'itinéraire naturel traverse l'Allemagne d'ouest en est, par Francfort et Dresde, puis entre par Görlitz vers Wrocław, ou plus au nord vers Poznań et Varsovie. Paris est à environ 1 600 km de Varsovie. Le seuil d'alcoolémie polonais est de 0,2 g/L, nettement plus strict que le seuil français : la marge est trop faible pour un verre avant de reprendre la route.`,
    },
    faqPlus: [
      {
        q: `Je ramène une voiture achetée en Pologne, quelle durée prévoir ?`,
        a: `Le trajet vers la France demande généralement deux jours de route. Prévoyez une marge pour les démarches et les imprévus : une formule de 5 à 10 jours coûte peu et évite de se retrouver sans couverture si le retour prend du retard.`,
      },
      {
        q: `Comment fonctionnent les péages polonais ?`,
        a: `Une partie des autoroutes est concédée et se paie à des barrières, le reste du réseau national relève du système électronique e-TOLL. Ces frais de circulation sont distincts de l'assurance : votre contrat AssuTempo couvre la responsabilité civile, pas les péages.`,
      },
    ],
  },

  portugal: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,5 g/L, 0,2 g/L pour les permis de moins de 3 ans`,
      peage: `Péages électroniques, certains axes sans barrière`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour le Portugal`,
      texte: `Aucun autre pays ne concentre autant de trajets automobiles saisonniers depuis la France : la communauté portugaise descend en voiture chaque été, souvent à plusieurs conducteurs sur 1 800 km. C'est le cas d'école du second conducteur ajouté pour la durée du voyage. S'y ajoutent l'achat de véhicule sur place et le véhicule familial resté au pays, conduit quelques semaines par an.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `La route classique passe par Bordeaux, Irun, puis Burgos et Salamanque avant d'entrer par Vilar Formoso, environ 1 700 km depuis Paris jusqu'à Lisbonne. Une partie du réseau portugais fonctionne en péage électronique sans barrière : les autoroutes dites SCUT se paient par lecture de plaque, ce qui suppose d'enregistrer le véhicule ou de régler ensuite dans un bureau de poste.`,
    },
    faqPlus: [
      {
        q: `Comment payer les péages sans barrière au Portugal ?`,
        a: `Les autoroutes en péage électronique lisent la plaque et n'ont pas de guichet. Un véhicule étranger s'enregistre à un point d'accueil près de la frontière, ou règle ensuite dans un bureau de poste. C'est une redevance de circulation, sans lien avec la validité de votre assurance.`,
      },
      {
        q: `Ajouter un second conducteur pour la descente est-il possible ?`,
        a: `C'est un usage très fréquent sur ce trajet. La formule courte permet de couvrir un conducteur pour la seule durée du voyage, sans modifier le contrat annuel du propriétaire du véhicule ni engager d'année supplémentaire.`,
      },
    ],
  },

  'republique-tcheque': {
    identite: {
      statut: `Union européenne`,
      monnaie: `Couronne tchèque`,
      conduite: `À droite`,
      alcool: `0,0 g/L, tolérance zéro`,
      peage: `E-vignette obligatoire sur autoroutes et voies rapides`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la République tchèque`,
      texte: `Prague est une destination de court séjour par excellence, trois à cinq jours, et le pays sert de couloir entre l'Allemagne, la Pologne et l'Autriche. Deux configurations qui appellent une couverture calée sur des jours et non sur une année. Le marché tchèque de l'occasion alimente aussi des convoyages vers l'ouest, avec le même besoin de couvrir uniquement le trajet de rapatriement.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `On traverse l'Allemagne par Strasbourg, Nuremberg puis l'entrée de Rozvadov vers Plzeň et Prague, environ 1 050 km depuis Paris. L'e-vignette tchèque est dématérialisée et liée à la plaque : elle s'achète en ligne avant le départ, ce qui évite l'arrêt en station à la frontière. La tolérance zéro sur l'alcool y est appliquée strictement, y compris aux conducteurs étrangers.`,
    },
    faqPlus: [
      {
        q: `La tolérance zéro tchèque vaut-elle pour les conducteurs français ?`,
        a: `Oui, sans exception liée à la nationalité ou au pays d'immatriculation. Le seuil est de 0,0 g/L, contre 0,5 g/L en France : aucune consommation n'est admise avant de prendre le volant.`,
      },
      {
        q: `Où acheter l'e-vignette tchèque ?`,
        a: `En ligne sur le portail officiel, avant le départ, ou dans les stations proches de la frontière. Elle est rattachée à la plaque d'immatriculation et contrôlée par caméra. Elle ne remplace en aucun cas l'attestation d'assurance, qui reste une obligation distincte.`,
      },
    ],
  },

  roumanie: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Leu`,
      conduite: `À droite`,
      alcool: `0,0 g/L, tolérance zéro`,
      peage: `Vignette rovinieta obligatoire sur le réseau national`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Roumanie`,
      texte: `Les trajets vers la Roumanie sont longs et très saisonniers, portés par une diaspora nombreuse qui rentre au pays en voiture. Le convoyage de véhicules est l'autre grand motif : beaucoup de voitures achetées en Europe de l'Ouest partent vers l'est, et le trajet demande une couverture le temps de la route. Dans les deux cas, le besoin se compte en jours et non en années.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `L'itinéraire dominant passe par l'Allemagne, l'Autriche et la Hongrie, avant l'entrée de Nădlac vers Arad et Sibiu, soit environ 2 000 km depuis Paris. La rovinieta est obligatoire sur tout le réseau national, y compris hors autoroute, et s'achète en ligne ou en station. La route Transfăgărășan, souvent citée, n'ouvre qu'une partie de l'année à cause de la neige.`,
    },
    faqPlus: [
      {
        q: `La rovinieta est-elle obligatoire même sans emprunter d'autoroute ?`,
        a: `Oui, elle couvre l'ensemble du réseau routier national roumain, pas seulement les autoroutes. Elle se rattache à la plaque d'immatriculation et se contrôle électroniquement. Comme toutes les vignettes, elle est indépendante de l'obligation d'assurance.`,
      },
      {
        q: `Quel seuil d'alcoolémie s'applique en Roumanie ?`,
        a: `La tolérance est de 0,0 g/L, sans distinction pour les conducteurs étrangers. C'est l'un des régimes les plus stricts d'Europe, à l'image de la Hongrie et de la République tchèque traversées sur la route d'accès.`,
      },
    ],
  },

  'royaume-uni': {
    identite: {
      statut: `Hors Union européenne`,
      monnaie: `Livre sterling`,
      conduite: `À gauche`,
      alcool: `0,8 g/L en Angleterre, au pays de Galles et en Irlande du Nord, 0,5 g/L en Écosse`,
      peage: `Réseau majoritairement gratuit, péages ponctuels et ULEZ à Londres`,
      urgence: `999 ou 112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour le Royaume-Uni`,
      texte: `Depuis la sortie de l'Union européenne, le passage est redevenu une frontière au sens plein, avec contrôles et formalités. Le besoin de couverture courte reste pourtant très vivant : week-ends à Londres, tournées professionnelles, et surtout achat de véhicules, le marché britannique étant riche en modèles absents du continent. Le retour d'un véhicule à conduite à droite vers la France est un cas classique.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `Deux voies : le tunnel sous la Manche par la navette Eurotunnel depuis Calais, 35 minutes de traversée, ou le ferry Calais-Douvres et Dieppe-Newhaven. Londres est à environ 290 km de Calais. Il faut ensuite s'habituer à la conduite à gauche, et Londres cumule le péage urbain de congestion et la zone à très faibles émissions ULEZ, tous deux payants pour les véhicules étrangers.`,
    },
    faqPlus: [
      {
        q: `Le Brexit a-t-il changé quelque chose à la couverture d'assurance ?`,
        a: `Le Royaume-Uni reste l'un des 34 pays couverts par votre carte internationale d'assurance automobile AssuTempo. Ce qui a changé relève de la douane et du contrôle aux frontières, pas de la validité de votre responsabilité civile automobile.`,
      },
      {
        q: `Faut-il payer l'ULEZ à Londres avec une plaque française ?`,
        a: `Oui, la zone à très faibles émissions s'applique aux véhicules étrangers, avec un paiement en ligne à effectuer pour chaque jour de circulation. Elle s'ajoute au péage de congestion du centre. Ces redevances sont indépendantes de l'assurance.`,
      },
    ],
  },

  slovaquie: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,0 g/L, tolérance zéro`,
      peage: `E-vignette obligatoire sur les routes D et R`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Slovaquie`,
      texte: `La Slovaquie est d'abord un pays de passage sur l'axe Vienne-Cracovie et vers l'Ukraine, franchi en quelques heures. C'est aussi un pays d'industrie automobile, avec des convoyages fréquents vers l'ouest. Les Hautes Tatras attirent enfin des séjours de randonnée et de ski dont les dates sont fixées à l'avance. Trois profils, une même caractéristique : une durée connue avant le départ.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `On rejoint Munich puis Vienne, et Bratislava se trouve à moins de 80 km de la capitale autrichienne, environ 1 400 km depuis Paris. L'e-vignette slovaque est liée à la plaque et exigée sur les autoroutes D et les voies rapides R. Vers l'est, le relief se creuse et l'hiver y est rude : les conditions changent vite dès que l'on quitte la plaine du Danube.`,
    },
    faqPlus: [
      {
        q: `Bratislava est très proche de Vienne, faut-il deux contrats ?`,
        a: `Non. L'Autriche et la Slovaquie font toutes deux partie des 34 pays couverts. Un aller-retour dans la journée entre les deux capitales est couvert par un contrat unique, sans démarche à la frontière.`,
      },
      {
        q: `Le seuil d'alcool en Slovaquie est-il vraiment de zéro ?`,
        a: `Oui, la règle est la tolérance zéro pour tous les conducteurs, y compris étrangers. C'est plus strict que le seuil français de 0,5 g/L, et cela vaut aussi dans plusieurs pays voisins comme la Hongrie et la République tchèque.`,
      },
    ],
  },

  slovenie: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Euro`,
      conduite: `À droite`,
      alcool: `0,5 g/L, 0,0 g/L pour les permis de moins de 3 ans`,
      peage: `E-vignette obligatoire dès les premiers kilomètres d'autoroute`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Slovénie`,
      texte: `Peu de pays sont autant traversés par rapport à leur taille : la Slovénie relie l'Italie à la Croatie et à l'Autriche, et des centaines de milliers de vacanciers la franchissent chaque été en quelques heures. C'est le cas type du besoin de courte durée. Le pays gagne aussi des séjours propres, autour du lac de Bled et des Alpes juliennes, sur une semaine ou deux.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `On descend par Milan et Venise, puis l'on entre par Trieste vers Ljubljana, environ 900 km depuis Lyon. La variante nord passe par l'Autriche et le tunnel des Karawanken. Attention au piège le plus commun sur cette route : la vignette est exigée dès les premiers kilomètres d'autoroute, et les contrôles se font juste après le dernier point de vente frontalier.`,
    },
    faqPlus: [
      {
        q: `On ne fait que traverser la Slovénie, la vignette est-elle vraiment obligatoire ?`,
        a: `Oui, dès l'entrée sur le réseau autoroutier, même pour une traversée d'une heure. C'est l'infraction la plus courante des vacanciers en transit vers la Croatie. La vignette est un droit de circulation, distinct de l'assurance couverte par votre contrat.`,
      },
      {
        q: `Un trajet Italie, Slovénie, Croatie tient-il sur un seul contrat ?`,
        a: `Oui. Les trois pays font partie des 34 pays couverts, et aucune formalité d'assurance n'est à accomplir aux frontières intérieures. Une seule souscription suffit pour l'ensemble de la descente et du retour.`,
      },
    ],
  },

  suede: {
    identite: {
      statut: `Union européenne`,
      monnaie: `Couronne suédoise`,
      conduite: `À droite`,
      alcool: `0,2 g/L`,
      peage: `Péages urbains automatiques à Stockholm et Göteborg`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Suède`,
      texte: `La Suède se parcourt sur de longues distances et se traverse pour rejoindre la Norvège ou la Finlande. Les voyages y durent deux à trois semaines, avec souvent plusieurs conducteurs qui se relaient. Second usage, le véhicule de loisir sorti pour l'été seulement, camping-car ou break familial, qu'il serait absurde d'assurer douze mois pour trois semaines de route.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `On remonte par l'Allemagne jusqu'à Copenhague, puis l'on franchit le pont de l'Öresund vers Malmö, environ 1 500 km depuis Paris. Stockholm et Göteborg appliquent une taxe de congestion prélevée automatiquement par lecture de plaque. Hors des grands axes, la faune traverse beaucoup : les collisions avec les élans sont un risque sérieux, surtout à l'aube et au crépuscule.`,
    },
    faqPlus: [
      {
        q: `Comment se paient les péages urbains suédois ?`,
        a: `Par lecture automatique de plaque à l'entrée des zones de Stockholm et Göteborg, sans arrêt ni barrière. La facture est adressée ensuite au titulaire du véhicule. Il s'agit d'une taxe de circulation, sans rapport avec l'assurance en responsabilité civile.`,
      },
      {
        q: `Suède, Norvège et Danemark sur un même voyage, un seul contrat suffit ?`,
        a: `Oui. Les trois pays figurent parmi les 34 pays couverts, comme l'Allemagne sur la route d'accès. Un contrat unique suit le véhicule sur tout le circuit scandinave, ponts et ferries compris.`,
      },
    ],
  },

  suisse: {
    identite: {
      statut: `Hors Union européenne`,
      monnaie: `Franc suisse`,
      conduite: `À droite`,
      alcool: `0,5 g/L, 0,1 g/L pour les permis de moins de 3 ans`,
      peage: `Vignette autoroutière annuelle obligatoire`,
      urgence: `112`,
    },
    usages: {
      titre: `Pourquoi une temporaire pour la Suisse`,
      texte: `La Suisse cumule trois besoins courts. Le transit vers l'Italie par les tunnels alpins, quelques heures qui exigent tout de même une couverture valable. Le travail frontalier depuis Annemasse, Ferney ou Saint-Louis, avec ses véhicules de remplacement et ses prêts ponctuels. Et les séjours au ski, dont les dates sont connues des mois à l'avance. Les contrôles routiers y sont réputés méthodiques, et l'attestation d'assurance fait partie des documents demandés.`,
    },
    acces: {
      titre: `Depuis la France`,
      texte: `Plusieurs portes : Bâle depuis l'Alsace, Genève depuis le Pays de Gex, Vallorbe depuis la Franche-Comté. Paris est à environ 540 km de Genève. La vignette autoroutière est annuelle et obligatoire dès le premier kilomètre d'autoroute, sans formule courte : c'est la surprise classique du conducteur qui ne fait que traverser. Le tunnel du Grand-Saint-Bernard se paie en supplément.`,
    },
    faqPlus: [
      {
        q: `Existe-t-il une vignette suisse de courte durée ?`,
        a: `Non, la vignette autoroutière suisse est vendue à l'année, quelle que soit la durée réelle du séjour, et elle est exigée dès le premier kilomètre d'autoroute. Elle est indépendante de l'assurance, que votre contrat AssuTempo couvre pour la durée exacte de votre passage.`,
      },
      {
        q: `La Suisse est hors Union européenne, la couverture change-t-elle ?`,
        a: `Non. Elle fait partie des 34 pays couverts par la carte internationale d'assurance automobile AssuTempo, et la responsabilité civile y est active dès le premier jour du contrat, comme dans les pays de l'Union.`,
      },
    ],
  },
};

/* ─── Contrôle d'intégrité au chargement ────────────────────────────────────
   Une fiche sans profil retomberait silencieusement sur l'affichage generique,
   c'est-a-dire sur le probleme que ce fichier corrige. Mieux vaut le voir. */
export function slugsSansProfil(slugs) {
  return slugs.filter((s) => !PAYS_PROFIL[s]);
}

/* ─────────────────────────────────────────────────────────────────────────────
   Balises uniques par pays.

   Pourquoi elles ne vivent pas dans countries-content.js : les champs `title`
   et `metaDescription` des overrides y sont du CODE MORT depuis le commit
   d21d0bf2 (SEO, titles tronques). Carte.jsx fabrique ses balises avec un
   gabarit `titrePays()` qui garantit les 60 caracteres, mais produit 34 titles
   de forme identique au nom de pays pres, et 34 descriptions strictement
   identiques a la meme substitution pres. Or le portique (regles 6 et 7 de
   scripts/quality-gate.mjs) refuse tout title > 60 et toute description > 155 :
   les anciens champs, ecrits avant cette regle, la violent presque tous, d'ou
   leur abandon plutot que leur correction.

   Ce tableau reprend l'intention d'origine en respectant les deux plafonds.
   Longueurs verifiees au build par le portique, et par le script de controle
   decrit dans la PR. Si une valeur venait a depasser, Carte.jsx retombe sur
   l'ancien gabarit : une balise generique vaut mieux qu'une balise coupee.
───────────────────────────────────────────────────────────────────────────── */
export const PAYS_SEO = {
  allemagne: {
    title: `Assurance temporaire Allemagne : import auto | AssuTempo`,
    desc: `Assurance temporaire en Allemagne dès le 1er jour : import de véhicule, trajets frontaliers, RC obligatoire. Attestation immédiate en 5 minutes.`,
  },
  andorre: {
    title: `Assurance temporaire Andorre : ski et douane | AssuTempo`,
    desc: `Assurance temporaire en Andorre dès le 1er jour : N20 par le Pas de la Case, principauté hors UE, RC obligatoire. Attestation immédiate en 5 minutes.`,
  },
  autriche: {
    title: `Assurance temporaire Autriche : vignette | AssuTempo`,
    desc: `Assurance temporaire en Autriche dès le 1er jour : vignette autoroutière, cols alpins payants, équipement hiver. Attestation immédiate en 5 minutes.`,
  },
  belgique: {
    title: `Assurance temporaire Belgique : frontaliers | AssuTempo`,
    desc: `Assurance temporaire en Belgique dès le 1er jour : achat de véhicule, trajets frontaliers, zones de basses émissions. Attestation immédiate en 5 min.`,
  },
  'bosnie-herzegovine': {
    title: `Assurance temporaire Bosnie-Herzégovine | AssuTempo`,
    desc: `Assurance temporaire en Bosnie-Herzégovine dès le 1er jour : pays hors UE, carte verte au poste frontière, RC obligatoire. Attestation en 5 minutes.`,
  },
  bulgarie: {
    title: `Assurance temporaire Bulgarie : e-vignette | AssuTempo`,
    desc: `Assurance temporaire en Bulgarie dès le 1er jour : e-vignette liée à la plaque, passage à l'euro en 2026, RC obligatoire. Attestation en 5 minutes.`,
  },
  chypre: {
    title: `Assurance temporaire Chypre : conduite à gauche | AssuTempo`,
    desc: `Assurance temporaire à Chypre dès le 1er jour : conduite à gauche, île sans péage, RC obligatoire. Attestation immédiate en 5 minutes.`,
  },
  croatie: {
    title: `Assurance temporaire Croatie : péages et été | AssuTempo`,
    desc: `Assurance temporaire en Croatie dès le 1er jour : péage au passage, corridor de Neum, séjour d'été borné. Attestation immédiate en 5 minutes.`,
  },
  danemark: {
    title: `Assurance temporaire Danemark : ponts payants | AssuTempo`,
    desc: `Assurance temporaire au Danemark dès le 1er jour : ponts du Grand Belt et de l'Öresund, route vers la Scandinavie. Attestation en 5 minutes.`,
  },
  espagne: {
    title: `Assurance temporaire Espagne : achat et été | AssuTempo`,
    desc: `Assurance temporaire en Espagne dès le 1er jour : achat de véhicule, descente estivale, zones à faibles émissions. Attestation en 5 minutes.`,
  },
  estonie: {
    title: `Assurance temporaire Estonie : circuit balte | AssuTempo`,
    desc: `Assurance temporaire en Estonie dès le 1er jour : circuit balte, alcool à 0,2 g/L, réseau sans péage. Attestation immédiate en 5 minutes.`,
  },
  finlande: {
    title: `Assurance temporaire Finlande : road trip | AssuTempo`,
    desc: `Assurance temporaire en Finlande dès le 1er jour : road trip vers la Laponie, routes sans péage, faune sur la route. Attestation en 5 minutes.`,
  },
  france: {
    title: `Assurance temporaire France : achat et prêt | AssuTempo`,
    desc: `Assurance temporaire en France dès le 1er jour : achat entre particuliers, véhicule prêté, conducteur résilié. Attestation en 5 minutes.`,
  },
  grece: {
    title: `Assurance temporaire Grèce : ferry et péages | AssuTempo`,
    desc: `Assurance temporaire en Grèce dès le 1er jour : ferry depuis l'Italie, péages au passage, RC obligatoire. Attestation immédiate en 5 minutes.`,
  },
  hongrie: {
    title: `Assurance temporaire Hongrie : e-vignette | AssuTempo`,
    desc: `Assurance temporaire en Hongrie dès le 1er jour : e-vignette liée à la plaque, tolérance zéro sur l'alcool. Attestation en 5 minutes.`,
  },
  irlande: {
    title: `Assurance temporaire Irlande : ferry et M50 | AssuTempo`,
    desc: `Assurance temporaire en Irlande dès le 1er jour : ferry depuis Cherbourg, conduite à gauche, péage M50 sans barrière. Attestation en 5 minutes.`,
  },
  islande: {
    title: `Assurance temporaire Islande : route 1 | AssuTempo`,
    desc: `Assurance temporaire en Islande dès le 1er jour : route circulaire numéro 1, pistes F réservées, hors UE mais couverte. Attestation en 5 minutes.`,
  },
  italie: {
    title: `Assurance temporaire Italie : péages et ZTL | AssuTempo`,
    desc: `Assurance temporaire en Italie dès le 1er jour : péage au ticket, zones à trafic limité, achat de véhicule ancien. Attestation en 5 minutes.`,
  },
  lettonie: {
    title: `Assurance temporaire Lettonie : circuit balte | AssuTempo`,
    desc: `Assurance temporaire en Lettonie dès le 1er jour : circuit balte par Riga, routes en gravier, réseau sans péage. Attestation en 5 minutes.`,
  },
  lituanie: {
    title: `Assurance temporaire Lituanie : Via Baltica | AssuTempo`,
    desc: `Assurance temporaire en Lituanie dès le 1er jour : Via Baltica, couloir de Suwalki, alcool à 0,4 g/L. Attestation immédiate en 5 minutes.`,
  },
  luxembourg: {
    title: `Assurance temporaire Luxembourg : frontaliers | AssuTempo`,
    desc: `Assurance temporaire au Luxembourg dès le 1er jour : trajets frontaliers, réseau entièrement gratuit, RC obligatoire. Attestation en 5 minutes.`,
  },
  malte: {
    title: `Assurance temporaire Malte : conduite à gauche | AssuTempo`,
    desc: `Assurance temporaire à Malte dès le 1er jour : conduite à gauche, archipel sans péage, ferry depuis la Sicile. Attestation en 5 minutes.`,
  },
  montenegro: {
    title: `Assurance temporaire Monténégro : carte verte | AssuTempo`,
    desc: `Assurance temporaire au Monténégro dès le 1er jour : pays hors UE à l'euro, carte verte à la frontière, tunnel de Sozina. Attestation en 5 min.`,
  },
  norvege: {
    title: `Assurance temporaire Norvège : péages AutoPASS | AssuTempo`,
    desc: `Assurance temporaire en Norvège dès le 1er jour : péages AutoPASS sans barrière, route des fjords, hors UE mais couverte. Attestation en 5 minutes.`,
  },
  'pays-bas': {
    title: `Assurance temporaire Pays-Bas : achat auto | AssuTempo`,
    desc: `Assurance temporaire aux Pays-Bas dès le 1er jour : achat de véhicule, autoroutes gratuites, zones environnementales. Attestation en 5 minutes.`,
  },
  pologne: {
    title: `Assurance temporaire Pologne : import auto | AssuTempo`,
    desc: `Assurance temporaire en Pologne dès le 1er jour : rapatriement de véhicule, feux allumés toute l'année, alcool à 0,2 g/L. Attestation en 5 minutes.`,
  },
  portugal: {
    title: `Assurance temporaire Portugal : 2e conducteur | AssuTempo`,
    desc: `Assurance temporaire au Portugal dès le 1er jour : second conducteur pour la descente, péages sans barrière. Attestation en 5 minutes.`,
  },
  'republique-tcheque': {
    title: `Assurance temporaire République tchèque | AssuTempo`,
    desc: `Assurance temporaire en République tchèque dès le 1er jour : e-vignette liée à la plaque, tolérance zéro sur l'alcool. Attestation en 5 minutes.`,
  },
  roumanie: {
    title: `Assurance temporaire Roumanie : rovinieta | AssuTempo`,
    desc: `Assurance temporaire en Roumanie dès le 1er jour : vignette rovinieta sur tout le réseau, tolérance zéro sur l'alcool. Attestation en 5 minutes.`,
  },
  'royaume-uni': {
    title: `Assurance temporaire Royaume-Uni : ULEZ | AssuTempo`,
    desc: `Assurance temporaire au Royaume-Uni dès le 1er jour : Eurotunnel depuis Calais, conduite à gauche, ULEZ à Londres. Attestation en 5 minutes.`,
  },
  slovaquie: {
    title: `Assurance temporaire Slovaquie : e-vignette | AssuTempo`,
    desc: `Assurance temporaire en Slovaquie dès le 1er jour : e-vignette sur routes D et R, tolérance zéro, Hautes Tatras. Attestation en 5 minutes.`,
  },
  slovenie: {
    title: `Assurance temporaire Slovénie : transit | AssuTempo`,
    desc: `Assurance temporaire en Slovénie dès le 1er jour : vignette exigée dès l'entrée sur autoroute, pays de transit. Attestation en 5 minutes.`,
  },
  suede: {
    title: `Assurance temporaire Suède : péages urbains | AssuTempo`,
    desc: `Assurance temporaire en Suède dès le 1er jour : péages urbains automatiques, pont de l'Öresund, faune sur la route. Attestation en 5 minutes.`,
  },
  suisse: {
    title: `Assurance temporaire Suisse : vignette annuelle | AssuTempo`,
    desc: `Assurance temporaire en Suisse dès le 1er jour : vignette autoroutière annuelle, transit alpin, travail frontalier. Attestation en 5 minutes.`,
  },
};

/* ─────────────────────────────────────────────────────────────────────────────
   Lecture recommandee par pays.

   Les 34 fiches n'envoyaient AUCUN lien vers un article : elles recevaient
   du maillage sans jamais en rendre. Une page qui ne renvoie nulle part
   ressemble a une page de facade, et le cluster editorial ne recevait rien
   des pages les plus nombreuses du site.

   L'article retenu est celui qui correspond a l'usage dominant decrit dans le
   champ `usages` du meme pays : import et rapatriement, convoyage, pret de
   vehicule, sejour long, ou vehicule etranger circulant en France. La cible
   change donc d'une fiche a l'autre, ce qui evite un enieme bloc identique
   sur 34 pages.
───────────────────────────────────────────────────────────────────────────── */
const LECTURES = {
  'assurance-trajet-retour-achat-voiture': `Assurance pour le trajet de retour après un achat`,
  'assurance-temporaire-convoyage-professionnel': `Convoyage professionnel : quelle assurance véhicule`,
  'assurance-temporaire-pret-de-vehicule': `Prêter ou emprunter un véhicule sans risque`,
  'assurance-auto-temporaire-1-mois': `Assurance temporaire d'une semaine ou d'un mois`,
  'assurance-temporaire-vehicule-etranger-france': `Véhicule ou permis étranger circulant en France`,
  'assurance-temporaire-attestation-immediate': `Attestation d'assurance immédiate, comment ça marche`,
};

const LECTURE_PAR_PAYS = {
  allemagne: 'assurance-trajet-retour-achat-voiture',
  andorre: 'assurance-temporaire-pret-de-vehicule',
  autriche: 'assurance-auto-temporaire-1-mois',
  belgique: 'assurance-trajet-retour-achat-voiture',
  'bosnie-herzegovine': 'assurance-temporaire-attestation-immediate',
  bulgarie: 'assurance-trajet-retour-achat-voiture',
  chypre: 'assurance-temporaire-pret-de-vehicule',
  croatie: 'assurance-auto-temporaire-1-mois',
  danemark: 'assurance-trajet-retour-achat-voiture',
  espagne: 'assurance-trajet-retour-achat-voiture',
  estonie: 'assurance-trajet-retour-achat-voiture',
  finlande: 'assurance-auto-temporaire-1-mois',
  france: 'assurance-temporaire-vehicule-etranger-france',
  grece: 'assurance-temporaire-pret-de-vehicule',
  hongrie: 'assurance-temporaire-convoyage-professionnel',
  irlande: 'assurance-temporaire-attestation-immediate',
  islande: 'assurance-temporaire-pret-de-vehicule',
  italie: 'assurance-trajet-retour-achat-voiture',
  lettonie: 'assurance-trajet-retour-achat-voiture',
  lituanie: 'assurance-temporaire-convoyage-professionnel',
  luxembourg: 'assurance-temporaire-vehicule-etranger-france',
  malte: 'assurance-temporaire-pret-de-vehicule',
  montenegro: 'assurance-temporaire-attestation-immediate',
  norvege: 'assurance-auto-temporaire-1-mois',
  'pays-bas': 'assurance-trajet-retour-achat-voiture',
  pologne: 'assurance-trajet-retour-achat-voiture',
  portugal: 'assurance-auto-temporaire-1-mois',
  'republique-tcheque': 'assurance-trajet-retour-achat-voiture',
  roumanie: 'assurance-trajet-retour-achat-voiture',
  'royaume-uni': 'assurance-trajet-retour-achat-voiture',
  slovaquie: 'assurance-temporaire-convoyage-professionnel',
  slovenie: 'assurance-auto-temporaire-1-mois',
  suede: 'assurance-auto-temporaire-1-mois',
  suisse: 'assurance-temporaire-vehicule-etranger-france',
};

/* Trois destinations par fiche : l'article cible par l'usage du pays, le
   panorama international, et le duo croise assurance / carte grise impose
   par CLAUDE.md. Ancres descriptives, jamais "en savoir plus". */
export function lecturesPays(slug) {
  const cible = LECTURE_PAR_PAYS[slug];
  const liens = [];
  if (cible && LECTURES[cible]) {
    liens.push({ to: `/articles/${cible}`, label: LECTURES[cible] });
  }
  liens.push({
    to: '/articles/assurance-auto-etranger-france',
    label: `Assurance auto à l'étranger : les 3 cas de figure`,
  });
  liens.push({
    to: '/carte-grise',
    label: `Demande de carte grise et certificat provisoire`,
  });
  return liens;
}
