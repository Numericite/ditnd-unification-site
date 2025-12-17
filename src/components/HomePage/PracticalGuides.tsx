import { Card } from "@codegouvfr/react-dsfr/Card";
import { Badge } from "@codegouvfr/react-dsfr/Badge";

export const PracticalGuides = () => {
  return (
    <>
      <div
        className="container"
        style={{
          width: 360,
        }}
      >
        <Card
          border
          start={
            <ul className="fr-badges-group">
              <li>
                <Badge>Autisme</Badge>
              </li>
              <li>
                <Badge noIcon={true}>Définition</Badge>
              </li>
            </ul>
          }
          desc="Lorem ipsum dolor sit amet, consectetur adipiscing, incididunt, ut labore et dolore magna aliqua. Vitae sapien pellentesque habitant morbi tristique senectus et"
          footer={
            <a
              className="fr-link fr-icon-arrow-right-line fr-link--icon-right"
              href="#"
            >
              Voir la fiche
            </a>
          }
          size="medium"
          title="Qu'est ce que l'autisme"
          titleAs="h3"
        />
      </div>
    </>
  );
};
