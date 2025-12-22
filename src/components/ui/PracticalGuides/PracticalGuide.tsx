import { Card } from "@codegouvfr/react-dsfr/Card";
import { Badge } from "@codegouvfr/react-dsfr/Badge";

export const PracticalGuide = ({
  title,
  description,
  badge,
  condition,
}: {
  title: string;
  description: string;
  badge: string;
  condition: string;
}) => {
  return (
    <>
      <div className="container">
        <Card
          border
          start={
            <ul className="fr-badges-group">
              <li>
                <Badge>{condition}</Badge>
              </li>
              <li>
                <Badge noIcon={true}>{badge}</Badge>
              </li>
            </ul>
          }
          desc={description}
          footer={
            <a
              className="fr-link fr-icon-arrow-right-line fr-link--icon-right"
              href="#"
            >
              Voir la fiche
            </a>
          }
          size="medium"
          title={title}
          titleAs="h3"
        />
      </div>
    </>
  );
};
