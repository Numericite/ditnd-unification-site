import { Card } from "@codegouvfr/react-dsfr/Card";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { tss } from "tss-react";
import { fr } from "@codegouvfr/react-dsfr";
import { cx } from "@codegouvfr/react-dsfr/fr/cx";

type Props = {
  title: string;
  description: string;
  badge: string;
  slug: string;
  condition?: string;
  textColor: string;
  backgroundColor: string;
};

export const PracticalGuide = ({
  title,
  description,
  slug,
  badge,
  condition,
  textColor,
  backgroundColor,
}: Props) => {
  const { classes } = useStyles();

  return (
    <>
      <div className="container">
        <Card
          border
          start={
            <ul className="fr-badges-group">
              {condition && (
                <li>
                  <Badge
                    style={{
                      color: textColor,
                      backgroundColor: backgroundColor,
                    }}
                  >
                    {condition}
                  </Badge>
                </li>
              )}
              <li>
                <Badge noIcon={true}>{badge}</Badge>
              </li>
            </ul>
          }
          desc={description}
          footer={
            <a
              className="fr-link fr-icon-arrow-right-line fr-link--icon-right"
              href={`/guides/${slug}`}
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

const useStyles = tss.withName(PracticalGuide.name).create({
  badgeColor: {
    color: "white",
    backgroundColor: "black",
  },
});
