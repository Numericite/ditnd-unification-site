import CmsPage from "~/components/Pages/CmsPage";
import { getSectionPageServerSideProps } from "~/server/pages";

export default CmsPage;

export const getServerSideProps = getSectionPageServerSideProps;
