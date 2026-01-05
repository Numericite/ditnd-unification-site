import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { fr } from "@codegouvfr/react-dsfr";
import { Summary } from "@codegouvfr/react-dsfr/Summary";

import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";
import { tss } from "tss-react";
import Button from "@codegouvfr/react-dsfr/Button";
import { type FrIconClassName } from "@codegouvfr/react-dsfr/fr/generatedFromCss/classNames";

const socials: { icon: FrIconClassName; onClick: () => void }[] = [
  {
    icon: "fr-icon-facebook-circle-line",
    onClick: () => {},
  },
  { icon: "fr-icon-twitter-x-line", onClick: () => {} },
  { icon: "fr-icon-linkedin-box-line", onClick: () => {} },
  { icon: "fr-icon-mail-line", onClick: () => {} },
  {
    icon: "fr-icon-links-line",
    onClick: () => {
      const url = location.href;
      navigator.clipboard.writeText(url);
    },
  },
];

export default function PracticalGuidePage() {
  const router = useRouter();
  const slug = router.query.slug as string;
  const { classes, cx } = useStyles();

  const { data: guideData, isLoading: isLoadingData } =
    api.practicalGuide.getBySlug.useQuery({ slug: slug });

  if (isLoadingData) {
    return <div>Chargement…</div>;
  }

  if (!guideData || guideData.length === 0) {
    return <div>Fiche introuvable</div>;
  }

  const guide = guideData[0];

  return (
    <>
      {guide && (
        <div>
          <Head>
            <title>DITND - {guide.title}</title>
          </Head>
          <Breadcrumb
            currentPageLabel={guideData[0]?.title}
            homeLinkProps={{
              href: "/",
            }}
            segments={[
              {
                label: "Fiches Pratiques",
                linkProps: {
                  href: "/guides",
                },
              },
            ]}
          />
          <div className={fr.cx("fr-grid-row")}>
            <div
              className={fr.cx(
                "fr-pr-3v",
                "fr-col-lg-3",
                "fr-col-sm-12",
                "fr-mb-2w"
              )}
            >
              <Summary
                className={cx(classes.summarySticky)}
                links={[
                  {
                    linkProps: {
                      href: "#",
                    },
                    text: "Titre de l’ancre 1",
                  },
                  {
                    linkProps: {
                      href: "#",
                    },
                    text: "Titre de l’ancre 2",
                  },
                  {
                    linkProps: {
                      href: "#",
                    },
                    text: "Titre de l’ancre 3",
                  },
                  {
                    linkProps: {
                      href: "#fiches-pratiques",
                    },
                    text: "Ces fiches pratiques qui pourraient vous intéresser",
                  },
                  {
                    linkProps: {
                      href: "#formations",
                    },
                    text: "Ces fiches formations qui pourraient vous intéresser",
                  },
                ]}
                title="Sommaire"
              />
            </div>

            <div className={fr.cx("fr-col-12", "fr-col-lg-9")}>
              <h4>Fiches pratiques</h4>
              {guide.html && (
                <div
                  className={cx(classes.wysiwig)}
                  dangerouslySetInnerHTML={{ __html: guide.html }}
                ></div>
              )}
              <div className={cx(classes.footerContent)}>
                <div className={fr.cx("fr-mt-2w")}>
                  <p className={fr.cx("fr-text--md")}>Partager la page</p>
                  {socials.map((social) => (
                    <Button
                      iconId={social.icon}
                      onClick={social.onClick}
                      priority="tertiary"
                      title="Label button"
                    />
                  ))}
                </div>
              </div>
              <div className={cx(classes.footerContent)}>
                <div className={fr.cx("fr-mt-2w")}>
                  <h5 id="fiches-pratiques">
                    Ces fiches pratiques qui pourraient vous intéresser{" "}
                  </h5>
                </div>
                <div className={fr.cx("fr-mt-2w")}>
                  <h5 id="formations">
                    Ces fiches formations qui pourraient vous intéresser{" "}
                  </h5>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const useStyles = tss.withName(PracticalGuidePage.name).create(() => ({
  summarySticky: {
    position: "sticky",
    top: "20px",
  },
  footerContent: {
    borderTop: "2px solid var(--border-default-grey)",
    marginBottom: fr.spacing("3w"),
  },
  wysiwig: {
    h3: {
      color: fr.colors.decisions.text.active.blueFrance.default,
    },
  },
}));
