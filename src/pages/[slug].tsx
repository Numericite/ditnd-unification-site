import CmsPage from "~/components/Pages/CmsPage";
import { getPageServerSideProps } from "~/server/pages";

export default CmsPage;

export const getServerSideProps = getPageServerSideProps(null);
