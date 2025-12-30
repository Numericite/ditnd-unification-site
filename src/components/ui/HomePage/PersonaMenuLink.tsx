import { fr } from "@codegouvfr/react-dsfr";

export const PersonaMenuLink = ({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) => {
  return (
    <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-col-12")}>
      <div
        className={fr.cx("fr-col-3")}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span className={icon} aria-hidden="true"></span>
      </div>
      <div className={fr.cx("fr-col-9")}>
        <div className="fr-text--sm fr-text--bold">{title}</div>
        <div className={fr.cx("fr-text--xs")}>{description}</div>
      </div>
    </div>
  );
};
