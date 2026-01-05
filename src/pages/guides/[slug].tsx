import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { fr } from "@codegouvfr/react-dsfr";
import { Summary } from "@codegouvfr/react-dsfr/Summary";

import Breadcrumb from "@codegouvfr/react-dsfr/Breadcrumb";
import Head from "next/head";

export default function PracticalGuidePage() {
  const router = useRouter();
  const slug = router.query.slug as string;

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
            <div className={fr.cx("fr-pr-3v")}>
              <Summary
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
                ]}
                title="Sommaire"
              />
            </div>

            <div className={fr.cx("fr-col-12", "fr-col-md-8")}>
              <h4>Fiches pratiques</h4>
              {guide.html && (
                <div
                  className="content"
                  dangerouslySetInnerHTML={{ __html: guide.html }}
                ></div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
